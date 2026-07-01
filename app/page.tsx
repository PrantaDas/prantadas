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
    url: "https://prantadas.dev",
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

    const allRepos: Repository[] = await response.json();
    const repoByName = new Map(allRepos.map((r) => [r.name, r]));

    // projectsData is the source of truth — every listed project renders even
    // if the GitHub API list is stale (cached before the repo existed) or the
    // repo is private. Live stats/topics are overlaid when the repo is found.
    const enhanced: Repository[] = projectsData.map((p) => {
      const repo = repoByName.get(p.name);
      return {
        id: repo?.id ?? p.name.split("").reduce((h, c) => h + c.charCodeAt(0), 0),
        name: p.name,
        description: p.description ?? repo?.description ?? "No description available",
        html_url: repo?.html_url ?? `https://github.com/Prantadas/${p.name}`,
        stargazers_count: repo?.stargazers_count ?? 0,
        forks_count: repo?.forks_count ?? 0,
        watchers_count: repo?.watchers_count ?? 0,
        language: p.language ?? repo?.language ?? "Unknown",
        topics: repo?.topics ?? [],
        created_at: repo?.created_at ?? new Date().toISOString(),
        updated_at: repo?.updated_at ?? new Date().toISOString(),
        category: p.category,
        priority: p.priority,
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

  const BASE_URL = "https://prantadas.dev";

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Projects by Pranta Das",
    numberOfItems: repositories.length,
    itemListElement: repositories.slice(0, 20).map((repo, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: repo.name,
        description: repo.description,
        codeRepository: repo.html_url,
        programmingLanguage: repo.language,
        url: repo.html_url,
        author: { "@type": "Person", name: "Pranta Das", url: BASE_URL },
        keywords: (repo.topics ?? []).join(", "),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <PortfolioClient
        repositories={repositories}
        year={year}
        articles={articles}
      />
    </>
  );
}
