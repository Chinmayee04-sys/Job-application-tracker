import { JobOpportunity } from "@/types";

const API_BASE = "/api/jobs";

const MOCK_JOBS: JobOpportunity[] = [
  {
    jobId: 1,
    employerName: "TechCorp India",
    locationName: "Bangalore",
    minimumSalary: 1200000,
    maximumSalary: 1800000,
    currency: "INR",
    jobTitle: "Senior React Native Developer",
    jobUrl: "https://www.reed.co.uk/jobs/senior-react-native-developer/1",
    jobDescription: "Build and maintain cross-platform mobile applications using React Native. Work with a talented team of engineers in our Bangalore office.",
    datePosted: new Date(Date.now() - 86400000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 45,
  },
  {
    jobId: 2,
    employerName: "FinTech Solutions",
    locationName: "Mumbai",
    minimumSalary: 800000,
    maximumSalary: 1400000,
    currency: "INR",
    jobTitle: "Full Stack Developer",
    jobUrl: "https://www.reed.co.uk/jobs/full-stack-developer/2",
    jobDescription: "Full stack developer with experience in React, Node.js, and cloud services. Financial services background a plus.",
    datePosted: new Date(Date.now() - 172800000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 30,
  },
  {
    jobId: 3,
    employerName: "HealthTech India",
    locationName: "Hyderabad",
    minimumSalary: 1500000,
    maximumSalary: 2500000,
    currency: "INR",
    jobTitle: "Mobile Engineering Lead",
    jobUrl: "https://www.reed.co.uk/jobs/mobile-engineering-lead/3",
    jobDescription: "Lead a team of mobile engineers building healthcare applications. React Native and native development experience required.",
    datePosted: new Date(Date.now() - 259200000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 18,
  },
  {
    jobId: 4,
    employerName: "E-Commerce Hub",
    locationName: "Remote (India)",
    minimumSalary: 1000000,
    maximumSalary: 1600000,
    currency: "INR",
    jobTitle: "Frontend Engineer (React)",
    jobUrl: "https://www.reed.co.uk/jobs/frontend-engineer-react/4",
    jobDescription: "Build beautiful, performant user interfaces for our e-commerce platform. Remote-first culture with team meetups.",
    datePosted: new Date(Date.now() - 345600000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 55,
  },
  {
    jobId: 5,
    employerName: "DataDriven Inc",
    locationName: "Bangalore",
    minimumSalary: 1800000,
    maximumSalary: 2800000,
    currency: "INR",
    jobTitle: "TypeScript Backend Engineer",
    jobUrl: "https://www.reed.co.uk/jobs/typescript-backend-engineer/5",
    jobDescription: "Design and implement scalable backend services using TypeScript, Node.js, and cloud infrastructure.",
    datePosted: new Date(Date.now() - 432000000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 22,
  },
  {
    jobId: 6,
    employerName: "StartupXYZ",
    locationName: "Remote (India)",
    minimumSalary: 500000,
    maximumSalary: 900000,
    currency: "INR",
    jobTitle: "Junior React Developer",
    jobUrl: "https://www.reed.co.uk/jobs/junior-react-developer/6",
    jobDescription: "Great opportunity for a junior developer to join a fast-growing startup. Mentorship and growth opportunities available.",
    datePosted: new Date(Date.now() - 518400000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 120,
  },
  {
    jobId: 7,
    employerName: "CloudScale Ltd",
    locationName: "Pune",
    minimumSalary: 1400000,
    maximumSalary: 2200000,
    currency: "INR",
    jobTitle: "DevOps Engineer",
    jobUrl: "https://www.reed.co.uk/jobs/devops-engineer/7",
    jobDescription: "Manage and improve cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines required.",
    datePosted: new Date(Date.now() - 604800000).toISOString(),
    expirationDate: null,
    jobType: "Contract",
    applicationCount: 15,
  },
  {
    jobId: 8,
    employerName: "AILabs India",
    locationName: "Chennai",
    minimumSalary: 2000000,
    maximumSalary: 3500000,
    currency: "INR",
    jobTitle: "AI/ML Engineer",
    jobUrl: "https://www.reed.co.uk/jobs/ai-ml-engineer/8",
    jobDescription: "Research and implement machine learning models for production. Python, PyTorch, and MLOps experience needed.",
    datePosted: new Date(Date.now() - 691200000).toISOString(),
    expirationDate: null,
    jobType: "Permanent",
    applicationCount: 40,
  },
];

interface ReedApiResponse {
  results: JobOpportunity[];
  totalResults: number;
  error?: string;
}

export async function fetchJobsFromApi(
  keywords: string = "developer",
  location: string = ""
): Promise<JobOpportunity[]> {
  const query = new URLSearchParams({
    keywords,
    ...(location && { location: location }),
  });

  try {
    const response = await fetch(`${API_BASE}?${query}`);
    if (!response.ok) return Promise.resolve(MOCK_JOBS);
    const data: ReedApiResponse = await response.json();
    if (data.error) return Promise.resolve(MOCK_JOBS);
    return data.results || MOCK_JOBS;
  } catch {
    return MOCK_JOBS;
  }
}

export function getMockJobs(): JobOpportunity[] {
  return MOCK_JOBS;
}

export function formatSalary(
  min: number,
  max: number,
  currency: string
): string {
  const symbol =
    currency === "INR" ? "\u20B9" :
    currency === "GBP" ? "\u00A3" :
    currency === "EUR" ? "\u20AC" :
    currency === "USD" ? "$" : "";
  const fmt = (n: number) => {
    if (currency === "INR") {
      if (n >= 10000000) return `${symbol}${(n / 10000000).toFixed(1)} Cr`;
      if (n >= 100000) return `${symbol}${(n / 100000).toFixed(1)} L`;
      return `${symbol}${n.toLocaleString("en-IN")}`;
    }
    if (n >= 1000) return `${symbol}${(n / 1000).toFixed(0)}k`;
    return `${symbol}${n}`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return "Salary not listed";
}

export function timeAgo(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
