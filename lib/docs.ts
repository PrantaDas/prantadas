import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  package: string; // npm package name
  npmUrl: string;
  repoUrl: string;
  language: string;
  tags: string[];
  order: number;
  readingTime: string;
  readingMinutes: number;
}

export interface Doc extends DocMeta {
  content: string;
}

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

function parseDoc(fileName: string): Doc {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(DOCS_DIR, fileName), "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    package: data.package ?? slug,
    npmUrl: data.npmUrl ?? `https://www.npmjs.com/package/${data.package ?? slug}`,
    repoUrl: data.repoUrl ?? "",
    language: data.language ?? "TypeScript",
    tags: data.tags ?? [],
    order: data.order ?? 999,
    readingTime: rt.text,
    readingMinutes: Math.ceil(rt.minutes),
    content,
  };
}

export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getDoc(slug: string): Doc | null {
  const file = ["mdx", "md"]
    .map((ext) => `${slug}.${ext}`)
    .find((f) => fs.existsSync(path.join(DOCS_DIR, f)));
  if (!file) return null;
  return parseDoc(file);
}

export function getAllDocs(): Doc[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseDoc)
    .sort((a, b) => a.order - b.order);
}
