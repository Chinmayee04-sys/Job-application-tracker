import { useState, useEffect, useCallback, useRef } from "react";
import { JobApplication, Statistics, ApplicationFilter } from "@/types";
import {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  toggleFavorite as toggleFav,
  getStatistics,
} from "@/services/applications";

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cache = useRef<JobApplication[]>([]);

  const load = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    const [apps, stats] = await Promise.all([
      getAllApplications(),
      getStatistics(),
    ]);
    cache.current = apps;
    setApplications(apps);
    setStatistics(stats);
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await load(true);
  }, [load]);

  const add = useCallback(
    async (data: Omit<JobApplication, "id" | "appliedDate" | "createdAt" | "updatedAt">) => {
      const app = await createApplication(data);
      await load(true);
      return app;
    },
    [load]
  );

  const update = useCallback(
    async (id: string, data: Partial<JobApplication>) => {
      const app = await updateApplication(id, data);
      await load(true);
      return app;
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteApplication(id);
      await load(true);
    },
    [load]
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      const app = await toggleFav(id);
      await load(true);
      return app;
    },
    [load]
  );

  const getFiltered = useCallback(
    (filter: ApplicationFilter): JobApplication[] => {
      let result = [...cache.current];

      if (filter.status !== "all") {
        result = result.filter((a) => a.status === filter.status);
      }

      if (filter.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(
          (a) =>
            a.company.toLowerCase().includes(q) ||
            a.role.toLowerCase().includes(q) ||
            a.location.toLowerCase().includes(q)
        );
      }

      result.sort((a, b) => {
        let cmp = 0;
        switch (filter.sortField) {
          case "date":
            cmp =
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime();
            break;
          case "company":
            cmp = a.company.localeCompare(b.company);
            break;
          case "status": {
            const order = [
              "wishlist",
              "applied",
              "interview",
              "rejected",
              "offer",
            ];
            cmp = order.indexOf(a.status) - order.indexOf(b.status);
            break;
          }
          case "salary": {
            const sa = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
            const sb = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
            cmp = sb - sa;
            break;
          }
        }
        return filter.sortOrder === "asc" ? cmp : -cmp;
      });

      return result;
    },
    []
  );

  return {
    applications,
    statistics,
    isLoading,
    isRefreshing,
    refresh,
    add,
    update,
    remove,
    toggleFavorite,
    getFiltered,
  };
}
