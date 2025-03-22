"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, ExternalLink, Calendar, Phone, Star, GitFork, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { professionalProject, projectsData } from "@/data/projects"
import { skillsData } from "@/data/skills"

// GitHub repository type
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

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeLanguage, setActiveLanguage] = useState("all")
  const [languages, setLanguages] = useState<string[]>([])

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        // Fetch all repositories from GitHub API
        const response = await fetch("https://api.github.com/users/Prantadas/repos?per_page=100")
        if (!response.ok) {
          throw new Error("Failed to fetch repositories")
        }
        const allRepos = await response.json()

        // Filter to only include the repositories in our list
        const filteredRepos = allRepos.filter((repo: any) => projectsData.some((project) => project.name === repo.name))

        // Merge our project data with GitHub data
        const enhancedRepos = filteredRepos.map((repo: any) => {
          const projectInfo = projectsData.find((project) => project.name === repo.name)
          return {
            ...repo,
            category: projectInfo?.category || "Other",
            priority: projectInfo?.priority || 999,
            description: projectInfo?.description || repo.description || "No description available",
          }
        })

        // Sort by priority
        const sortedRepos = enhancedRepos.sort((a: Repository, b: Repository) => a.priority - b.priority)

        // Extract unique languages
        const allLanguages = sortedRepos
          .map((repo: Repository) => repo.language)
          .filter((language: string | null): language is string => language !== null && language !== undefined)

        setLanguages(["all", ...Array.from(new Set(allLanguages)) as string[]])
        setRepositories(sortedRepos)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching repositories:", error)
        // Fallback to our static data if API fails
        const staticRepos = projectsData.map((project) => ({
          id: Math.random(),
          name: project.name,
          description: project.description,
          html_url: `https://github.com/Prantadas/${project.name}`,
          stargazers_count: 0,
          forks_count: 0,
          watchers_count: 0,
          language: project.language || "Unknown",
          topics: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: project.category,
          priority: project.priority,
        }))

        setLanguages(["all", ...Array.from(new Set(staticRepos.map((repo) => repo.language)))])
        setRepositories(staticRepos)
        setIsLoading(false)
      }
    }

    fetchRepositories()
  }, [])

  // Filter repositories based on active category and language
  const filteredRepositories = repositories.filter((repo) => {
    const categoryMatch = activeCategory === "all" || repo.category === activeCategory
    const languageMatch = activeLanguage === "all" || repo.language === activeLanguage
    return categoryMatch && languageMatch
  })

  // Function to scroll to section when nav link is clicked
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header/Navigation */}
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

      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <section id="about" className="py-12 md:py-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src="/profile.jpeg"
                alt="Pranta Das"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <Badge className="mb-4">Available for hire</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hi, I'm Pranta Das</h1>
            <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6">Node.js Developer</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              An edacious programming enthusiast who loves the art of coding. Always looking for perfection in my craft,
              but never satisfied with what I have done, so I bring improvisation every day.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button asChild>
                <Link href="https://github.com/Prantadas" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://linkedin.com/in/pranta-das7" target="_blank" className="flex items-center">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-center md:justify-start text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Dhanmondi 32, Dhaka-1210, Bangladesh</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <Link href="tel:+8801708088432">+8801708088432</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-8 md:py-12">
          <div className="bg-primary/5 rounded-lg p-8 md:p-12 text-center">
            <blockquote className="text-xl md:text-2xl font-medium italic text-muted-foreground">
              "We do this not because it is easy, but because we thought it would be easy"
            </blockquote>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my recent work and open-source contributions
            </p>
          </div>

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

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
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
                            <CardDescription className="truncate">
                              {repo.description || "No description available"}
                            </CardDescription>
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
                              <Link href={repo.html_url} target="_blank">
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
                </>
              )}
            </TabsContent>

            <TabsContent value="professional" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{
  professionalProject.map((p)=>(
    <Card className="overflow-hidden transition-all hover:shadow-lg" key={p.name}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{p.name}</CardTitle>
                      <Badge>{p.category}</Badge>
                    </div>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                    {p.details}
                    </p>
                    {
                      p.is_private ?  <p className="text-xs text-muted-foreground mt-2 italic">
                      Due to confidentiality constraints, the specific details and source code are not publicly
                      accessible.
                    </p>:<></>
                    }
                  </CardContent>
                  <CardFooter className="flex justify-between">
                  {
                    p.is_private ? <Button variant="outline" disabled>Private Project</Button> :   <Button variant="outline" size="sm" asChild>
                    <Link href={p.website?? ""} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Link>
                  </Button>
                  }
                  </CardFooter>
                </Card>
  ))
}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Skills & Technologies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Technologies and tools I work with</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillsData.map((skill, index) => (
              <Card key={index} className="flex flex-col items-center p-6 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 mb-4 w-16 h-16 flex items-center justify-center">
                  <div className="text-primary font-bold text-2xl">{<skill.logo/>}</div>
                </div>
                <h3 className="font-medium text-center">{skill.name}</h3>
              </Card>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">My professional journey</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Junior Software Engineer</CardTitle>
                    <CardDescription>Root Devs, Asad Avenue, Mohammadpur, Dhaka</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>April 2024 - Present</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Backend Development & web automation.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Junior Developer (MERN)</CardTitle>
                    <CardDescription>CoreDevs.Ltd, Mirpur DOHS, Dhaka</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>August 2022 - February 2024</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Frontend and backend development, web automation & scripting.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education Section */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Education</h2>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Bachelor of Science (CSE)</CardTitle>
                    <CardDescription>Daffodil International University, Dhaka</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>September 2018 - July 2022</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Higher Secondary Certificate (Science)</CardTitle>
                    <CardDescription>Cantonment College, Jashore</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>April 2016 - March 2018</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Secondary School Certificate (Science)</CardTitle>
                    <CardDescription>Panjia Secondary School, Jashore</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>January 2014 - February 2016</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Professional Highlights Section */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Professional Highlights</h2>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="p-8">
              <p className="text-lg text-center">
                Recognised and praised for outstanding contributions and dedication in delivering high-impact solutions,
                meeting deadlines, and showcasing a commitment to excellence in project delivery and team collaboration.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Feel free to reach out for collaborations or just a friendly hello
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Here's how you can reach me</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-primary" />
                  <span>Dhanmondi 32, Dhaka-1210, Bangladesh</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-primary" />
                  <Link href="tel:+8801708088432" className="hover:text-primary transition-colors">
                    +8801708088432
                  </Link>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-primary" />
                  <Link href="mailto:prantodas043@gmail.com" className="hover:text-primary transition-colors">
                    prantodas043@gmail.com
                  </Link>
                </div>
                <div className="flex items-center">
                  <Github className="mr-3 h-5 w-5 text-primary" />
                  <Link
                    href="https://github.com/Prantadas"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    github.com/Prantadas
                  </Link>
                </div>
                <div className="flex items-center">
                  <Linkedin className="mr-3 h-5 w-5 text-primary" />
                  <Link
                    href="https://linkedin.com/in/pranta-das7"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    linkedin.com/in/pranta-das7
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send Me a Message</CardTitle>
                <CardDescription>I'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your message"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Pranta Das. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/Prantadas"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://linkedin.com/in/pranta-das7"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

