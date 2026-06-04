import { Metadata } from "next";
import { projectsData } from "@/data/projects";
import { getAllBlogPosts, getFeaturedPost } from "@/lib/blog";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";

export const metadata: Metadata = {
  title: "Pranta Das — Backend Developer & Team Lead | Bangladesh",
  description:
    "Backend Developer & Team Lead from Dhaka, Bangladesh with 3+ years of experience. Expert in Node.js, TypeScript, NestJS, REST APIs, PostgreSQL, and distributed systems. Open to senior engineering roles.",
  openGraph: {
    title: "Pranta Das — Backend Developer & Team Lead | Bangladesh",
    description:
      "Backend Developer & Team Lead from Dhaka, Bangladesh. Node.js · TypeScript · NestJS · PostgreSQL · 3+ years building scalable platforms.",
    url: "https://prantadas.vercel.app",
    siteName: "Pranta Das",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranta Das — Backend Developer & Team Lead",
    description:
      "Backend Developer from Dhaka, Bangladesh. Node.js · TypeScript · NestJS · 3+ years building scalable systems.",
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

// ISR: revalidate the page (and the footer year) once a day. The GitHub
// fetch below already sets the same window, so the page stays static + fast
// instead of being forced dynamic on every navigation.
export const revalidate = 86400;

export default async function Home() {
  const [repositories, featuredPost, allPosts] = await Promise.all([
    getRepositories(),
    getFeaturedPost(),
    getAllBlogPosts(),
  ]);
  const year = new Date().getFullYear();

  // Hero = the post flagged `featured: true` (the same one /blog leads with),
  // falling back to the most recent. The grid is the next most-recent posts,
  // so the homepage stays in sync automatically as new articles are added.
  const byDateDesc = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const hero = featuredPost ?? byDateDesc[0];
  const rest = byDateDesc.filter((p) => p.slug !== hero?.slug).slice(0, 4);
  const ordered = hero ? [hero, ...rest] : rest;

  const articles = ordered.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags,
    readingTime: p.readingTime,
  }));

  return (
    <PortfolioClient
      repositories={repositories}
      year={year}
      articles={articles}
    />
  );
}
