const projectsData = [
  {
    name: "al-quran-sdk",
    description:
      "A TypeScript SDK for accessing various resources related to the Quran, including verses, chapters, audio recitations, and translations.",
    category: "SDK",
    priority: 1,
    language: "TypeScript",
  },
  {
    name: "tRPC-starter",
    description:
      "A starter template for building applications with tRPC, providing type-safe API development.",
    category: "Backend",
    priority: 5,
    language: "TypeScript",
  },
  {
    name: "Miintfun-NFT-Buy-Bot",
    description:
      "A web3 NFT minting bot that gets the NFT from https://miintfun mints website depending on multiple conditions.",
    category: "Bot",
    priority: 2,
    language: "Python",
  },
  {
    name: "port-finder",
    description:
      "A utility tool to find available ports on a system for application deployment.",
    category: "Tool",
    priority: 10,
    language: "JavaScript",
  },
  {
    name: "log-ingestor",
    description:
      "A service for collecting, processing, and storing application logs efficiently.",
    category: "Backend",
    priority: 8,
    language: "JavaScript",
  },
  {
    name: "MintfunGO",
    description:
      "A Go implementation of the NFT minting bot for the Miintfun platform.",
    category: "Bot",
    priority: 7,
    language: "Go",
  },
  {
    name: "agent-007",
    description:
      "An automated agent for performing various tasks and operations.",
    category: "Tool",
    priority: 12,
    language: "JavaScript",
  },
  {
    name: "play-scrapper",
    description: "A web scraper for extracting data from Google Play Store.",
    category: "Scraper",
    priority: 15,
    language: "JavaScript",
  },
  {
    name: "firemsg",
    description: "A real-time messaging system built with Firebase.",
    category: "Backend",
    priority: 9,
    language: "JavaScript",
  },
  {
    name: "Qbit-Go",
    description:
      "A Telegram bot for downloading torrent files. Simply add the download link to the bot and it will start downloading.",
    category: "Bot",
    priority: 3,
    language: "Go",
  },
  {
    name: "express-pulse-logger",
    description:
      "A logging middleware for Express.js applications with advanced features.",
    category: "Tool",
    priority: 11,
    language: "JavaScript",
  },
  {
    name: "echo-power",
    description:
      "A powerful Echo server implementation with extended capabilities.",
    category: "Backend",
    priority: 14,
    language: "Go",
  },
  {
    name: "http-streaming",
    description: "A library for handling HTTP streaming responses efficiently.",
    category: "Backend",
    priority: 13,
    language: "JavaScript",
  },
  {
    name: "sms-bomber",
    description:
      "A tool for testing SMS services by sending multiple messages.",
    category: "Tool",
    priority: 16,
    language: "Python",
  },
  {
    name: "TelegramBot-Scaffold",
    description:
      "A simple Telegram Bot boilerplate built on top of Telegraf.js to make the way of making a bot simpler.",
    category: "Bot",
    priority: 4,
    language: "TypeScript",
  },
  {
    name: "DiscordSwap-Duet",
    description:
      "A Discord bot for facilitating swaps and trades between users.",
    category: "Bot",
    priority: 6,
    language: "JavaScript",
  },
  {
    name: "GradeVista",
    description:
      "A grading system for educational institutions to manage student assessments.",
    category: "Backend",
    priority: 17,
    language: "JavaScript",
  },
  {
    name: "Power-Pulse",
    description:
      "A Telegram bot designed to provide users of DESCO (Prepaid User) with convenient access to their account details.",
    category: "Bot",
    priority: 5,
    language: "Python",
  },
  {
    name: "puppetter-web-scrapping",
    description:
      "A web scraping framework using Puppeteer for automated data extraction.",
    category: "Scraper",
    priority: 18,
    language: "JavaScript",
  },
  {
    name: "SeaDisc",
    description:
      "A Discord bot that listens to events from OpenSea on subscribed collections and sends direct messages to users.",
    category: "Bot",
    priority: 7,
    language: "TypeScript",
  },
  {
    name: "telegram-insight-spy-bot",
    description:
      "A Telegram bot for tracking and analyzing channel/group insights.",
    category: "Bot",
    priority: 19,
    language: "JavaScript",
  },
  {
    name: "amazon-scrapper",
    description: "A tool for scraping product data from Amazon.",
    category: "Scraper",
    priority: 20,
    language: "JavaScript",
  },
  {
    name: "td365-acountmaker",
    description: "An automated account creation tool for TD365 platform.",
    category: "Tool",
    priority: 21,
    language: "JavaScript",
  },
  {
    name: "discord-message-tracker-bot",
    description:
      "A Discord bot for tracking and analyzing message patterns in servers.",
    category: "Bot",
    priority: 22,
    language: "JavaScript",
  },
  {
    name: "cookie-harvester",
    description:
      "A tool for collecting and managing browser cookies for web automation.",
    category: "Tool",
    priority: 23,
    language: "JavaScript",
  },
  {
    name: "web-driver",
    description:
      "A wrapper around Selenium WebDriver with enhanced functionality.",
    category: "Tool",
    priority: 24,
    language: "JavaScript",
  },
  {
    name: "NASA-FB",
    description:
      "A bot that posts NASA's Astronomy Picture of the Day to Facebook.",
    category: "Bot",
    priority: 25,
    language: "JavaScript",
  },
];

const professionalProject = [
  {
    name: "CNF Sports",
    category: "Web App",
    description: "A web-based streaming platform for soccer",
    details:
      "The application serves a wide range of users with exciting live football matches. Similar applications - EMZ Sport, Kala Football.",
    website: "https://cnfspots.com",
    is_private: false,
  },
  {
    name: "EMZ Sport",
    category: "Web App",
    description: "A web-based streaming platform for soccer",
    details:
      "The application serves a wide range of users with exciting live football matches. Similar applications - EMZ Sport, Kala Football.",
    website: "https://emzsport.com",
    is_private: false,
  },
  {
    name: "Hola Football",
    category: "Web App",
    description: "A web-based streaming platform for soccer",
    details:
      "The application serves a wide range of users with exciting live football matches. Similar applications - EMZ Sport, Kala Football.",
    website: "https://kalafootball.com",
    is_private: false,
  },
  {
    name: "CNF Cart",
    category: "Payment Solution",
    description: "A centralized & zero-dependency payment solution",
    details:
      "The application serves different sports applications to manage payments through Stripe & Crypto. After each successful payment, the service notifies each individual application about the state of the payment.",
    website: "https://cnfcart.shop",
    is_private: false,
  },

  {
    name: "Joltori",
    category: "Booking System",
    description: "An online booking system for a houseboat",
    details:
      "The website aims to provide online booking of a houseboat. The users can reserve the room for a while and check out. From the admin panel, the booking is confirmed and notifies the user about the status.",
    website: "https://joltoriboat.com",
    is_private: false,
  },
  {
    name: "Scrumo",
    category: "Project Management",
    description: "A web-based project management application",
    details:
      "The application is built on from the idea of https://app.clickup.com for managing and tracking projects efficiently.",
    website: "https://projects.coredevs.ltd",
    is_private: false,
  },
  {
    name: "Cross Distance",
    category: "Educational Platform",
    description: "An online platform for teachers and students",
    details:
      "The platform offers the teachers to creating a profile with qualification verification, and the students are allowed to post for tutoring jobs. The teachers select the jobs based on their skills and initiate escrow contracts until the lesson is done.",
    confidential_note:
      "Due to confidentiality constraints, the specific details and source code are not publicly accessible.",
    is_private: true,
  },
];

export { projectsData, professionalProject };
