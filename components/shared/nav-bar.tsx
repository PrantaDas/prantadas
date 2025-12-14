"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={"/"}>
          <div className="font-bold text-xl">Pranta Das</div>
        </Link>
        <nav className="hidden md:flex gap-6">
          <button
            onClick={() => scrollToSection("about")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection("certifications")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Certifications
          </button>
          <button
            onClick={() => scrollToSection("skills")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection("experience")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Experience
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </button>
        </nav>
        <Button onClick={() => scrollToSection("contact")} size="sm">
          Get in Touch
        </Button>
      </div>
    </header>
  )
}