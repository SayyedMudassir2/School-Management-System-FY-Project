
# Aedura - Elite School Management System

<p align="center">
  <img src="public/images/aedura-dashboard.png" alt="Aedura Dashboard" width="800"/>
</p>

<p align="center">
  An all-in-one, AI-powered digital platform to streamline school operations, enhance communication, and provide a seamless experience for administrators, teachers, students, and parents.
</p>

---

## ✨ Key Features

Aedura is a comprehensive ERP system designed for modern educational institutions, offering role-based dashboards and a wide range of modules to manage every aspect of school life.

- **Admin Dashboard**: A centralized command center with analytics on student enrollment, attendance, financials, and recent school activities.
- **Role-Based Access Control**: Secure, distinct dashboards tailored for **Administrators**, **Teachers**, **Students**, and **Parents**, ensuring users only see relevant information.
- **Student Management**: End-to-end student lifecycle management, including admissions, a searchable student directory, class promotions, and ID card/certificate generation.
- **Teacher Management**: Tools for managing faculty records, assigning class and subject teachers, and viewing staff lists.
- **Academic Management**: Comprehensive modules for setting up academic years, classes, subjects, and timetables.
- **Financial Control**: An integrated finance module for defining fee structures, collecting fees, generating receipts, tracking due payments, and managing school expenses.
- **Communication Hub**: A centralized system for sending announcements and messages to various user groups, including specific classes or all parents.
- **AI-Powered Insights**: Utilizes Generative AI (**Google's Gemini model via Genkit**) to provide actionable insights, such as analyzing attendance data to identify trends and suggest interventions for teachers.

## 🚀 Technology Stack

This project is built with a modern, robust, and scalable technology stack.

- **Framework**: [Next.js](https://nextjs.org/) 15 (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [ShadCN/UI](https://ui.shadcn.com/) for components.
- **Generative AI**: [Genkit (from Google)](https://firebase.google.com/docs/genkit) with [Google's Gemini](https://deepmind.google/technologies/gemini/) models.
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database**: [Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
- **Deployment**: Configured for [Vercel](https://vercel.com)

## 🔧 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v20.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

First, clone the project to your local machine.

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Install Dependencies

Install the necessary packages using npm.

```bash
npm install
```

### 3. Firebase Setup

This project requires a Firebase project to run.

- The application is configured to connect to a Firebase project using the configuration in `src/firebase/config.ts`.
- When running locally, the development server will use these credentials.
- **Important**: For features like Authentication and Firestore to work, you must have a corresponding Firebase project with these services enabled.

### 4. Run the Development Server

Start the Next.js development server.

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

### 5. Build for Production

To create an optimized production build, run the following command:

```bash
npm run build
```

This will prepare your application for deployment.
