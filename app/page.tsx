import { Metadata } from "next";
import { connection } from "next/server";
import { projectsData } from "@/data/projects";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";

export const metadata: Metadata = {
  title: "Pranta Das — Backend Developer",
  description:
    "Backend Developer specializing in Node.js, TypeScript, REST APIs, and scalable distributed systems. Team Lead at Root Devs.",
  keywords: [
    "Backend Developer",
    "Node.js",
    "TypeScript",
    "REST API",
    "Software Engineer",
    "Pranta Das",
  ],
  authors: [{ name: "Pranta Das" }],
  openGraph: {
    title: "Pranta Das — Backend Developer",
    description:
      "Backend Developer specializing in Node.js, TypeScript, REST APIs, and scalable distributed systems.",
    url: "https://prantadas.vercel.app",
    siteName: "Pranta Das",
    images: [
      { url: "/photo.webp", width: 800, height: 600, alt: "Pranta Das" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranta Das — Backend Developer",
    description:
      "Backend Developer specializing in Node.js, TypeScript, REST APIs, and scalable distributed systems.",
    images: ["/photo.webp"],
  },
};

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  category: string;
  priority: number;
}

async function getRepositories(): Promise<Repository[]> {
  try {
    const response = await fetch(
      "https://api.github.com/users/Prantadas/repos?per_page=100",
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) throw new Error("Failed to fetch");

    const allRepos = await response.json();

    const filtered = allRepos.filter((repo: Repository) =>
      projectsData.some((p) => p.name === repo.name),
    );

    const enhanced: Repository[] = filtered.map((repo: Repository) => {
      const info = projectsData.find((p) => p.name === repo.name);
      return {
        ...repo,
        category: info?.category ?? "Other",
        priority: info?.priority ?? 999,
        description:
          info?.description ?? repo.description ?? "No description available",
      };
    });

    return enhanced.sort((a, b) => a.priority - b.priority);
  } catch {
    return projectsData.map((p) => ({
      id: Math.random(),
      name: p.name,
      description: p.description,
      html_url: `https://github.com/Prantadas/${p.name}`,
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      language: p.language ?? "Unknown",
      topics: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: p.category,
      priority: p.priority,
    }));
  }
}

async function getYear(): Promise<number> {
  await connection();
  return new Date().getFullYear();
}

export default async function Home() {
  const [repositories, year] = await Promise.all([
    getRepositories(),
    getYear(),
  ]);

  return <PortfolioClient repositories={repositories} year={year} />;
}
