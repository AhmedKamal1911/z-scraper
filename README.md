# 🚀 Z-Scraper Platform — Full-Stack Automation & Web Scraping Platform

## 🧩 Overview
**Z-Scraper** is a full-stack automation platform that enables users to **visually build, validate, and execute complex web scraping workflows** using a **node-based workflow editor** inspired by modern automation tools.

Using **React Flow**, users can create drag-and-drop pipelines by connecting task nodes into executable workflows. Each workflow is **validated before execution** to ensure:
- ▶️ A valid entry point
- 🧠 Correct execution order & data dependencies
- ✅ All required inputs are properly connected or provided

---

## 🖱️ Workflow Capabilities

### 🧩 User Interactions
Simulate real user behavior inside the browser:
- ✍️ Fill input fields
- 🖱️ Click elements
- 🌍 Navigate between URLs
- 📜 Scroll to specific elements

### 📄 Data Extraction
Extract and structure data from web pages:
- 🧾 Convert full pages to HTML
- 🔍 Extract text from selected elements
- 🤖 AI-powered structured data extraction

### ⏱️ Timing Controls
Control execution timing and page readiness:
- ⏳ Wait for elements to appear before proceeding

### 🚀 Result Delivery
Send results to external systems:
- 🔗 Deliver extracted data via webhooks

### 🗄️ Data Storage & Transformation
Manipulate structured data across workflow steps:
- 📖 Read properties from JSON
- ➕ Add or modify JSON properties

---

## ⚙️ Backend Workflow Execution Engine

The platform is powered by a **custom-built workflow execution engine** designed and implemented from scratch:
- 🔄 Converts visual workflows into **multi-phase execution plans**
- 🧩 Resolves node dependencies and execution order
- ⏱️ Executes tasks phase-by-phase with a shared execution environment
- 🤖 Manages browser automation using **Puppeteer**
- 🪵 Handles failures gracefully with detailed per-phase execution logs

---

## 🔄 Execution System Features

- 🔗 Dynamic environment resolution for passing outputs between nodes
- 💳 Credit-based execution model (each task consumes credits)
- 🔒 Atomic credit deduction & failure handling using **Prisma**
- 📊 Per-phase status tracking with persistent execution history

---

## 🔐 Platform Infrastructure

- 👤 Authentication & user management with **Clerk**
- 💰 Subscriptions & payments powered by **Stripe**
- 🗄️ Persistent workflow executions stored in **PostgreSQL**
- 🌗 Dark / Light mode using **Next Themes**
- ⚡ Real-time UI state management via **React Query**

---

## 🧱 Scalable & Extensible Architecture

- 🧩 New task types and executors can be added via centralized **Task Registry** & **Executor Registry**
- 🔌 Core execution logic remains untouched when extending functionality
- 🏗️ Built with scalability and maintainability in mind

---

## 🛠 Tech Stack

**Frontend & UI**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Flow

**Backend & Infrastructure**
- Prisma
- PostgreSQL
- Puppeteer
- Clerk
- Stripe
- React Query

---

## 💡 Why This Project Matters

This project demonstrates **advanced system design**, **workflow orchestration**, **browser automation**, and **real-world SaaS architecture**, going far beyond typical CRUD-based applications.

