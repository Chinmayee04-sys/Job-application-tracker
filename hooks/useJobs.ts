import { useQuery } from "@tanstack/react-query";
import { fetchJobsFromApi } from "@/services/jobs";

export function useJobs(
  keywords: string = "developer",
  location: string = ""
) {
  return useQuery({
    queryKey: ["jobs", keywords, location],
    queryFn: () => fetchJobsFromApi(keywords, location),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
