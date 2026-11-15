import type { Project } from "../lib/api";

// Shown when VITE_API_URL is not set or the API is unreachable, so the site never looks empty.
// Keep in sync with `python manage.py seed_portfolio`. To add a project, copy one block and change it.
// `kind` must be "react", "react-native" or "js-html".
// `imageUrl`: leave "" to use an automatic screenshot, or use your own file like "/projects/speakzy.webp".
export const fallbackProjects: Project[] = [
  {
    "id": 1,
    "slug": "charity-donation-platform",
    "title": "Charity Donation Platform",
    "category": "Non-Profit Portal",
    "kind": "react",
    "summary": "Donor-engagement platform with modular donation calculators, real-time cause trackers and an interactive volunteer onboarding form.",
    "description": "A responsive non-profit portal built to make giving feel simple. Visitors can pick a cause, tune a donation amount and see its impact, or sign up to volunteer through a guided form.",
    "highlights": [
      "Modular donation calculators",
      "Real-time cause progress trackers",
      "Volunteer onboarding form with validation",
      "Fluid layout from phone to desktop"
    ],
    "tech": ["React", "Vite", "CSS", "Vercel"],
    "liveUrl": "https://charity-iota-olive.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/Charity",
    "imageUrl": "",
    "accent": "#2a9d8f",
    "year": 2026
  },
  {
    "id": 2,
    "slug": "full-featured-ecommerce-hub",
    "title": "Full-Featured E-Commerce Hub",
    "category": "Retail & Commerce",
    "kind": "react",
    "summary": "E-commerce storefront with real-time cart state, category filtering, product spotlight carousels and a simulated order flow.",
    "description": "A complete shopping experience: browse by category, spotlight featured products, manage a live cart and walk through a simulated checkout that requires login first.",
    "highlights": [
      "Real-time cart state management",
      "Category filtering",
      "Product spotlight carousels",
      "Login required before checkout"
    ],
    "tech": ["React", "Vite", "CSS", "Vercel"],
    "liveUrl": "https://ecommerce-web-ivory-zeta.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/ecommerce-web",
    "imageUrl": "",
    "accent": "#e76f51",
    "year": 2026
  },
  {
    "id": 3,
    "slug": "day-tracker",
    "title": "Day Tracker",
    "category": "Mobile App",
    "kind": "react-native",
    "summary": "A day-tracking app built with Expo and React Native, running on mobile and on the web.",
    "description": "A cross-platform day tracker built with React Native and Expo, with a web build deployed on Vercel.",
    "highlights": [],
    "tech": ["React Native", "Expo", "Vercel"],
    "liveUrl": "https://daytracker-pearl.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/Day-tracker",
    "imageUrl": "",
    "accent": "#6366f1",
    "year": 2026
  },
  {
    "id": 4,
    "slug": "shoe-shop",
    "title": "Shoe Shop",
    "category": "Retail & Commerce",
    "kind": "react",
    "summary": "Shoe store front end with a products listing and a dedicated offers page.",
    "description": "An online shoe shop with a browsable products listing and an Offers page built from that same listing data.",
    "highlights": ["Products listing", "Offers page"],
    "tech": ["React", "Vite", "Vercel"],
    "liveUrl": "https://shoeshop-fd.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/shoeshop-fd",
    "imageUrl": "",
    "accent": "#f59e0b",
    "year": 2026
  },
  {
    "id": 5,
    "slug": "student-task-manager",
    "title": "Student Task Manager",
    "category": "Productivity",
    "kind": "react",
    "summary": "A task manager for students to plan and track their work.",
    "description": "A simple task manager aimed at students, for keeping assignments and to-dos organised in one place.",
    "highlights": [],
    "tech": ["React", "Vite", "Vercel"],
    "liveUrl": "https://studenttaskmanage.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/Studenttaskmanage-fd",
    "imageUrl": "",
    "accent": "#0ea5e9",
    "year": 2026
  },
  {
    "id": 6,
    "slug": "speakzy",
    "title": "Speakzy",
    "category": "Web App",
    "kind": "js-html",
    "summary": "Speakzy web app, deployed on Vercel.",
    "description": "Speakzy web application deployed on Vercel.",
    "highlights": [],
    "tech": ["HTML", "CSS", "JavaScript", "Vercel"],
    "liveUrl": "https://speakzy-beige.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/Speakzy",
    "imageUrl": "",
    "accent": "#ec4899",
    "year": 2026
  },
  {
    "id": 7,
    "slug": "food-folw",
    "title": "FoodFolw",
    "category": "Web App",
    "kind": "js-html",
    "summary": "FoodFolw web app, deployed on Vercel.",
    "description": "FoodFolw web application deployed on Vercel.",
    "highlights": [],
    "tech": ["HTML", "CSS", "JavaScript", "Vercel"],
    "liveUrl": "https://food-folw.vercel.app",
    "repoUrl": "https://github.com/sundhar1704/FoodFolw",
    "imageUrl": "",
    "accent": "#84cc16",
    "year": 2026
  },
  {
    "id": 8,
    "slug": "fashion-photographer-site",
    "title": "Fashion Photographer Site",
    "category": "Portfolio Website",
    "kind": "js-html",
    "summary": "Multi-page photographer website with Home, About, Portfolio, Pricing and Contact pages.",
    "description": "A photographer's website for a fashion photographer and videographer, with separate pages for the about story, the portfolio, pricing and contact.",
    "highlights": [
      "Home, About, Portfolio, Pricing and Contact pages",
      "Responsive navigation menu"
    ],
    "tech": ["HTML", "CSS", "GitHub Pages"],
    "liveUrl": "https://sundhar1704.github.io/FashionProject/",
    "repoUrl": "https://github.com/sundhar1704/FashionProject",
    "imageUrl": "",
    "accent": "#8b5cf6",
    "year": 2026
  },
  {
    "id": 9,
    "slug": "weather-app",
    "title": "Weather App",
    "category": "Web App",
    "kind": "js-html",
    "summary": "Weather web app, deployed on GitHub Pages.",
    "description": "Weather web application deployed on GitHub Pages.",
    "highlights": [],
    "tech": ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    "liveUrl": "https://sundhar1704.github.io/weatherproject/WEATHER.HTML",
    "repoUrl": "https://github.com/sundhar1704/weatherproject",
    "imageUrl": "",
    "accent": "#06b6d4",
    "year": 2026
  }
];