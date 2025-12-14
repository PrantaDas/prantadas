"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Star, GitFork, Eye, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Repository {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string
  topics: string[]
  created_at: string
  updated_at: string
  category: string
  priority: number
}

interface ProfessionalProject {
  name: string
  category: string
  description: string
  details: string
  is_private: boolean
  website?: string
}

interface ProjectTabsProps {
  repositories: Repository[]
  languages: string[]
  professionalProjects: ProfessionalProject[]
}

export function ProjectTabs({ repositories, languages, professionalProjects }: ProjectTabsProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeLanguage, setActiveLanguage] = useState("all")

  const filteredRepositories = repositories.filter((repo) => {
    const categoryMatch = activeCategory === "all" || repo.category === activeCategory
    const languageMatch = activeLanguage === "all" || repo.language === activeLanguage
    return categoryMatch && languageMatch
  })

  return (
    <Tabs defaultValue="github" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList>
          <TabsTrigger value="github">GitHub Projects</TabsTrigger>
          <TabsTrigger value="professional">Professional Work</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="github" className="space-y-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            All
          </Button>
          <Button
            variant={activeCategory === "SDK" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("SDK")}
          >
            SDK
          </Button>
          <Button
            variant={activeCategory === "API" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("API")}
          >
            API
          </Button>
          <Button
            variant={activeCategory === "Bot" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("Bot")}
          >
            Bot
          </Button>
          <Button
            variant={activeCategory === "Tool" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("Tool")}
          >
            Tool
          </Button>
          <Button
            variant={activeCategory === "Backend" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("Backend")}
          >
            Backend
          </Button>
          <Button
            variant={activeCategory === "Scraper" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("Scraper")}
          >
            Scraper
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge
            variant="outline"
            className="text-xs cursor-pointer px-3 py-1 hover:bg-accent"
            onClick={() => setActiveLanguage("all")}
          >
            All Languages
          </Badge>
          {languages
            .filter((lang) => lang !== "all")
            .map((language) => (
              <Badge
                key={language}
                variant={activeLanguage === language ? "default" : "outline"}
                className="text-xs cursor-pointer px-3 py-1 hover:bg-accent"
                onClick={() => setActiveLanguage(language)}
              >
                {language}
              </Badge>
            ))}
        </div>

        {filteredRepositories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepositories.map((repo) => (
              <Card key={repo.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="truncate">{repo.name}</CardTitle>
                    <div className="flex gap-2">
                      {repo.language && <Badge>{repo.language}</Badge>}
                      <Badge variant="outline">{repo.category}</Badge>
                    </div>
                  </div>
                  <CardDescription className="truncate"></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {repo.description || "No description available"}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Star className="mr-1 h-4 w-4" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <GitFork className="mr-1 h-4 w-4" />
                      {repo.forks_count}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Eye className="mr-1 h-4 w-4" />
                      {repo.watchers_count}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Link>
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="professional" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {professionalProjects.map((p) => (
            <Card className="overflow-hidden transition-all hover:shadow-lg" key={p.name}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{p.name}</CardTitle>
                  <Badge>{p.category}</Badge>
                </div>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{p.details}</p>
                {p.is_private && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    Due to confidentiality constraints, the specific details and source code are not publicly
                    accessible.
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {p.is_private ? (
                  <Button variant="outline" disabled>
                    Private Project
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={p.website ?? ""} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}