// Client-side reading list, persisted to localStorage. Shared by the Save
// button (writes) and the Reading List panel (reads), kept in sync via a
// window event so an open panel reflects saves made elsewhere on the page.

export interface Bookmark {
  slug: string;
  title: string;
  savedAt: string;
}

export const BOOKMARKS_KEY = "blog_bookmarks";
export const BOOKMARKS_EVENT = "bookmarks:changed";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(bookmarks: Bookmark[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event(BOOKMARKS_EVENT));
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().some((b) => b.slug === slug);
}

export function addBookmark(slug: string, title: string) {
  const bookmarks = getBookmarks();
  if (bookmarks.some((b) => b.slug === slug)) return;
  bookmarks.push({ slug, title, savedAt: new Date().toISOString() });
  save(bookmarks);
}

export function removeBookmark(slug: string) {
  save(getBookmarks().filter((b) => b.slug !== slug));
}
