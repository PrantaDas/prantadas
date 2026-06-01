import { Metadata } from "next";
import { NotFoundClient } from "./not-found-client";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Pranta Das",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
