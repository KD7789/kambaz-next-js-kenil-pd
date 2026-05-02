# Kambaz – Next.js

A Canvas-inspired course management web app built with Next.js and TypeScript, developed as part of **CS5610 Web Development** at Northeastern University.

## Overview

Kambaz is a simplified learning management system (LMS) modeled after Canvas. It supports student and instructor workflows including sign-in/sign-up, a course dashboard, per-course module navigation, and more. The app also includes a Labs section that demos core HTML/CSS/JS concepts covered throughout the course.

## Features

- **Authentication** – Sign in, sign up, and profile pages under `/Account`
- **Dashboard** – Lists all published courses with navigation links
- **Course Pages** – Each course has Home, Modules, Assignments, People, and Grades tabs
- **Module View** – Collapsible weekly modules with learning objectives, readings, and slides
- **Labs** – Multi-lab exercises covering HTML tags, forms, tables, lists, images, and CSS
- **Navigation** – Persistent top nav with links to Dashboard, Calendar, Inbox, and Labs

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- CSS Modules
- Deployed on [Vercel](https://vercel.com/)

## Project Structure

```
kambaz-next-js-kenil-pd/
├── app/
│   ├── Account/          # Signin, Signup, Profile pages
│   ├── Dashboard/        # Course listing dashboard
│   ├── Courses/
│   │   └── [cid]/        # Dynamic course pages (Home, Modules, Assignments, People)
│   ├── Labs/             # Lab exercises 
│   ├── Calendar/
│   ├── Inbox/
│   └── layout.tsx        # Root layout with shared nav
├── public/               # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/KD7789/kambaz-next-js-kenil-pd.git
   cd kambaz-next-js-kenil-pd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Course

CS5610 – Web Development, Northeastern University (Fall 2025)  
