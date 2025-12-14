import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, ExternalLink, Calendar, Phone, Star, GitFork, Eye, Award, Shield } from "lucide-react"
import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { professionalProject, projectsData } from "@/data/projects"
import { skillsData } from "@/data/skills"
import { NavBar } from "@/components/shared/nav-bar"
import { ProjectTabs } from "@/components/shared/project-tab"
import { certifications } from "@/data/certification"
import { ContactForm } from "@/components/shared/contact-form"
import { Footer } from "@/components/shared/footer"


// Metadata for SEO
export const metadata: Metadata = {
  title: "Pranta Das - Backend Developer | Portfolio",
  description: "Backend Developer specializing in Node.js, REST APIs, and scalable solutions. View my projects, certifications, and professional experience.",
  keywords: ["Backend Developer", "Node.js", "REST API", "JavaScript", "Software Engineer", "Pranta Das"],
  authors: [{ name: "Pranta Das" }],
  openGraph: {
    title: "Pranta Das - Backend Developer",
    description: "Backend Developer specializing in Node.js, REST APIs, and scalable solutions",
    url: "https://prantadas.com",
    siteName: "Pranta Das Portfolio",
    images: [
      {
        url: "/profile.jpeg",
        width: 800,
        height: 600,
        alt: "Pranta Das",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranta Das - Backend Developer",
    description: "Backend Developer specializing in Node.js, REST APIs, and scalable solutions",
    images: ["/profile.jpeg"],
  },
}

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

// Fetch repositories on the server
async function getRepositories(): Promise<Repository[]> {
  try {
    const response = await fetch("https://api.github.com/users/Prantadas/repos?per_page=100", {
      next: { revalidate: 86400 }, // Revalidate every 24 hours
    })

    if (!response.ok) {
      throw new Error("Failed to fetch repositories")
    }

    const allRepos = await response.json()

    // Filter to only include the repositories in our list
    const filteredRepos = allRepos.filter((repo: any) => 
      projectsData.some((project) => project.name === repo.name)
    )

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
    return enhancedRepos.sort((a: Repository, b: Repository) => a.priority - b.priority)
  } catch (error) {
    console.error("Error fetching repositories:", error)
    
    // Fallback to static data if API fails
    return projectsData.map((project) => ({
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
  }
}

// Function to get certificate level badge color
function getCertificateLevel(name: string) {
  if (name.includes("Basic"))
    return { level: "Basic", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" }
  if (name.includes("Intermediate"))
    return { level: "Intermediate", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" }
  if (name.includes("Advanced"))
    return { level: "Advanced", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" }
  return { level: "Certified", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" }
}

export default async function Home() {
  const repositories = await getRepositories()
  
  // Extract unique languages
  const languages = [
    "all",
    ...Array.from(new Set(
      repositories
        .map((repo) => repo.language)
        .filter((language): language is string => language !== null && language !== undefined)
    ))
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header/Navigation */}
      <NavBar />

      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <section id="about" className="py-12 md:py-16 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src="/profile.jpeg"
                alt="Pranta Das - Backend Developer"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <Badge className="mb-4">Available for hire</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hi, I'm Pranta Das</h1>
            <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6">Backend Developer</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              An edacious programming enthusiast who loves the art of coding. Always looking for perfection in my craft,
              but never satisfied with what I have done, so I bring improvisation every day.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button asChild>
                <Link href="https://github.com/Prantadas" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://linkedin.com/in/pranta-das7" target="_blank" rel="noopener noreferrer">
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

          <ProjectTabs 
            repositories={repositories} 
            languages={languages}
            professionalProjects={professionalProject}
          />
        </section>

        {/* Certification Section */}
        <section id="certifications" className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certifications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional certifications from HackerRank demonstrating technical expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const { level, color } = getCertificateLevel(cert.name)
              return (
                <Card key={index} className="overflow-hidden transition-all hover:shadow-lg group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg leading-tight">{cert.name}</CardTitle>
                          <CardDescription className="text-sm">HackerRank</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${color} border-0 text-xs font-medium`}>{level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-primary/20 group-hover:border-primary/40 transition-colors">
                      <Link href={cert.iframeUrl} target="_blank" rel="noopener noreferrer" className="text-center">
                        <Shield className="h-12 w-12 text-primary/60 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">HackerRank Certificate</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to view on HackerRank</p>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Verified Certificate</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Industry Recognized</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                      <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Certificate on HackerRank
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Certification Summary */}
          <div className="mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Award className="h-8 w-8 text-primary hidden lg:block md:block" />
                  <h3 className="text-2xl font-bold">Technical Expertise Verified</h3>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  These certifications demonstrate proficiency in JavaScript, Node.js, and REST API development,
                  validated through rigorous testing on HackerRank's platform. Each certificate represents hands-on
                  coding skills and problem-solving abilities in real-world scenarios.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Badge variant="outline" className="px-4 py-2">
                    <span className="mr-2">🟢</span>
                    JavaScript Proficiency
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <span className="mr-2">🔵</span>
                    Node.js Development
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <span className="mr-2">🟡</span>
                    REST API Design
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <div className="text-primary font-bold text-2xl">
                    <skill.logo />
                  </div>
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
                    <CardTitle>Senior Software Engineer</CardTitle>
                    <CardDescription>Root Devs, Asad Avenue, Mohammadpur, Dhaka</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>October 2025 - Present</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Backend Development</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Software Engineer</CardTitle>
                    <CardDescription>Root Devs, Asad Avenue, Mohammadpur, Dhaka</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>June 2025 - September 2025</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Backend Development</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Junior Software Engineer</CardTitle>
                    <CardDescription>Root Devs, Asad Avenue, Mohammadpur, Dhaka</CardDescription>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>April 2024 - May 2025</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Backend Development</p>
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
                    rel="noopener noreferrer"
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
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    linkedin.com/in/pranta-das7
                  </Link>
                </div>
              </CardContent>
            </Card>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  )
}