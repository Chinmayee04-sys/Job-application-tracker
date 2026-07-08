import { JobApplication, ApplicationStatus, Statistics } from "@/types";
import {
  getApplications,
  setApplications,
} from "./storage";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export async function createApplication(
  data: Omit<JobApplication, "id" | "appliedDate" | "createdAt" | "updatedAt">
): Promise<JobApplication> {
  const apps = await getApplications();
  const now = new Date().toISOString();
  const application: JobApplication = {
    ...data,
    id: generateId(),
    appliedDate: now,
    createdAt: now,
    updatedAt: now,
  };
  apps.unshift(application);
  await setApplications(apps);
  return application;
}

export async function updateApplication(
  id: string,
  data: Partial<JobApplication>
): Promise<JobApplication> {
  const apps = await getApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Application not found");
  apps[index] = {
    ...apps[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await setApplications(apps);
  return apps[index];
}

export async function deleteApplication(id: string): Promise<void> {
  const apps = await getApplications();
  const filtered = apps.filter((a) => a.id !== id);
  await setApplications(filtered);
}

export async function toggleFavorite(id: string): Promise<JobApplication> {
  const apps = await getApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Application not found");
  apps[index] = {
    ...apps[index],
    isFavorite: !apps[index].isFavorite,
    updatedAt: new Date().toISOString(),
  };
  await setApplications(apps);
  return apps[index];
}

export async function getAllApplications(): Promise<JobApplication[]> {
  return getApplications();
}

export async function getApplicationById(
  id: string
): Promise<JobApplication | null> {
  const apps = await getApplications();
  return apps.find((a) => a.id === id) ?? null;
}

export async function getStatistics(): Promise<Statistics> {
  const apps = await getApplications();
  return {
    total: apps.length,
    applied: apps.filter((a) => a.status === "applied").length,
    interview: apps.filter((a) => a.status === "interview").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    offer: apps.filter((a) => a.status === "offer").length,
  };
}

export async function getApplicationsByStatus(
  status: ApplicationStatus
): Promise<JobApplication[]> {
  const apps = await getApplications();
  return apps.filter((a) => a.status === status);
}

export async function getUpcomingInterviews(): Promise<JobApplication[]> {
  const apps = await getApplications();
  const now = new Date();
  return apps
    .filter(
      (a) =>
        a.status === "interview" &&
        a.interviewDate &&
        new Date(a.interviewDate) >= now
    )
    .sort(
      (a, b) =>
        new Date(a.interviewDate!).getTime() -
        new Date(b.interviewDate!).getTime()
    );
}

export async function clearAllApplications(): Promise<void> {
  await setApplications([]);
}

export async function exportApplications(): Promise<string> {
  const apps = await getApplications();
  return JSON.stringify(apps, null, 2);
}
