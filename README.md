# 🛒 NexCart E-Commerce Platform

NexCart is a modern, full-stack e-commerce application built with Next.js 14, TypeScript, Tailwind CSS, and Prisma. It is specifically designed to serve as a robust target for AI-powered automated testing pipelines, featuring comprehensive `data-testid` coverage and predictable element naming conventions.

## 🚀 Key Features

- **Storefront**: Responsive product browsing, category filtering, and smart search.
- **Shopping Flow**: Optimized cart management, promo code support, and multi-step checkout.
- **Authentication**: Secure role-based auth (Admin/User) via NextAuth.js.
- **Admin Panel**: Full inventory management, order tracking, and sales analytics.
- **Test-Ready**: Every interactive element tagged for Playwright/Cypress.
- **Performance**: Static & Server rendering, optimized images, and local SQLite database.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Premium custom design)
- **Database**: Prisma + SQLite
- **Auth**: NextAuth.js (Credentials & JWT)
- **Validation**: Zod + React Hook Form
- **State**: React Context + Hooks

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- NPM / Yarn / PNPM

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd nexcart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and configure your `NEXTAUTH_SECRET`.
   ```bash
   cp .env.example .env
   ```

4. **Database Setup**
   Run migrations and seed the database with 40+ products and demo users.
   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## 🧪 Testing with Playwright

NexCart uses a strict `data-testid` naming convention:
`data-testid="[page]-[component]-[action or role]"`

Example:
- `login-email-input`
- `pdp-add-to-cart-btn`
- `admin-nav-products-btn`

## 🐳 Docker Deployment

Run the entire stack with Docker Compose:
```bash
docker-compose up --build
```

## 👤 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@nexcart.com` | `admin123` |
| **User** | `user@nexcart.com` | `password123` |

---

Developed with ❤️ for Advanced AI Agent Research.
