# Internship Management System - Admin Web Application

A centralized platform designed for university internship administrators to manage internship periods, students, supervisors, and geographical zones across Ghana.

## 📋 Overview

The Internship Management System (IMS) provides real-time visualization, monitoring, and administrative control over the university's internship processes. It empowers administrators to track supervision progress, visualize student locations on an interactive map, and generate comprehensive reports.

## ✨ Key Features

### 1. Authentication & Security

- **Secure Login**: Access via Staff ID or University email.
- **OTP Verification**: Multi-factor authentication with automatically generated OTPs sent to university emails.
- **Session Management**: Secure handling with automatic inactivity logout.

### 2. Analytical Dashboard

- **Real-time Metrics**: Track total registered students, deployed supervisors, and supervision completion status.
- **Data Visualization**: Interactive and responsive charts (e.g., Completed vs. Pending supervisions) for intuitive insights.

### 3. Map & Zoning Management

- **Ghana Internship Map**: Interactive map displaying student internship locations using markers.
- **Dynamic Zoning**: Draw polygon zones directly on the map to define geographical supervision areas.
- **Customization**: Assign unique colors, labels, and names to zones for clear distinction and persistence.

### 4. Internship Period Management

- **Window Control**: Create and manage internship windows with specific start/end dates and statuses (Open/Closed).
- **Onboarding Logic**: Automatically enable or disable student onboarding based on the active internship window.

### 5. Supervisor Management

- **Hybrid Entry**: Add supervisors manually or via CSV file upload.
- **Invitation System**: Track invitation status (Pending, Accepted) with automated email invitations.
- **Progress Tracking**: Monitor assigned zones and supervision completion percentages for each supervisor.

### 6. Student Management

- **Centralized Database**: Comprehensive list of all registered students with advanced filtering by zone, internship status, and supervision status.
- **Detailed Profiles**: View activity logs, organization details, and evaluation scores from both bank/company managers and university supervisors.

### 7. Reports & Export

- **PDF Generation**: Download student reports, supervision reports, and activity logs.
- **Granular Controls**: Export data per student, supervisor, zone, or internship period.

## 🛠 Tech Stack

- **Core**: [Next.js 16 (App Router)](https://nextjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod Validation](https://zod.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone [repository-url]
   cd internshiphub-admin
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the required environment variables (e.g., API base URL).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Common, Auth, Internship, Map, etc.).
- `lib/`: Core utilities, API calls, hooks (queries/mutations), and constants.
- `types/`: TypeScript definitions and interfaces.
- `public/`: Static assets and images.

## 🧪 Testing

Run the test suite using Jest:

```bash
npm test
```

## 🏗 Build

To create an optimized production build:

```bash
npm run build
```
