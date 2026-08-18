# 🚀 KaushalSetu

<div align="center">

### Connecting Skills with Opportunities

A full-stack, AI-powered workforce management platform that connects **Skilled Workers, Clients, Organizations, and Administrators** through one centralized digital ecosystem.

</div>

---

## 📌 About KaushalSetu

KaushalSetu is a full-stack workforce and employment management platform designed to simplify the process of finding skilled workers, posting jobs, managing applications, verifying worker credentials, creating contracts, and handling payments.

The platform brings together **Workers, Clients, Organizations, and Administrators** into a single system with secure authentication, role-based access, job management, KYC verification, contracts, payments, wallet management, reviews, notifications, and an AI-powered assistant.

---

## ✨ Key Features

- 🔐 JWT-based Authentication and Authorization
- 👥 Role-Based Access Control
- 👷 Worker Profile and Skill Management
- 💼 Job Posting and Job Applications
- 🪪 KYC and Document Verification
- 📄 Digital Contract Management
- 💳 Razorpay Payment Integration
- 💰 Wallet and Transaction Management
- ⭐ Reviews and Ratings
- 🔔 Notification Management
- 🤖 AI-powered KaushalBot Assistant
- 📊 Admin Dashboard and Platform Management

---

# 👥 User Roles

## 👷 Worker

Workers can:

- Create and manage their professional profile
- Add skills and certificates
- Complete KYC verification
- Browse available jobs
- Apply for suitable jobs
- Track job application status
- Manage contracts
- View payment history
- Access wallet information
- Track transactions
- Receive notifications
- Build their professional profile

---

## 🤝 Client

Clients can:

- Create and manage jobs
- Search for suitable workers
- View job applications
- Review worker profiles
- Accept or reject applicants
- Manage contracts
- Process payments
- Track hiring activities
- View payment history

---

## 🏢 Organization

Organizations can:

- Create and manage organization profiles
- Post job opportunities
- View worker applications
- Review worker profiles and documents
- Manage workers
- Create and manage contracts
- Handle payment workflows
- Track organization activities

---

## 🛡️ Administrator

Administrators can:

- Manage users
- Monitor platform activities
- Manage user roles
- Review KYC documents
- Approve or reject verification requests
- Monitor payments
- View dashboard statistics
- Manage system operations
- Maintain platform records

---

# 🔐 Authentication & Security

KaushalSetu uses a secure authentication and authorization system.

### Authentication features include:

- User Registration
- User Login
- JWT Token Generation
- JWT-based API Authentication
- Role-Based Authorization
- Email Verification
- OTP Verification
- Forgot Password
- Password Reset
- Protected API Endpoints
- Protected Frontend Routes

### Authentication Flow

```text
User
  ↓
Login / Registration
  ↓
Spring Security Authentication
  ↓
JWT Token Generated
  ↓
Frontend Stores Token
  ↓
Authenticated API Request
  ↓
Role-Based Authorization
```

---

# 💼 Job Management

KaushalSetu provides a complete job management system.

### Clients and Organizations can:

- Create jobs
- Update job details
- Delete jobs
- Manage job listings
- View applications
- Review applicants
- Select suitable workers
- Reject applications
- Track job status

### Workers can:

- Browse available jobs
- View job details
- Apply for jobs
- Track application status
- View their applications

---

# 🪪 KYC Verification

The platform includes a KYC verification workflow for workers.

### Workers can:

- Submit KYC information
- Upload verification documents
- Upload skill certificates
- Track verification status

### Administrators can:

- View KYC submissions
- Review uploaded documents
- Approve verification
- Reject verification
- Maintain KYC-related records

This verification process helps clients and organizations evaluate worker credibility.

---

# 📄 Contract Management

KaushalSetu provides a digital workflow for managing contracts between workers and employers.

```text
Job Posted
    ↓
Worker Applies
    ↓
Application Reviewed
    ↓
Worker Selected
    ↓
Contract Created
    ↓
Worker Accepts / Rejects
    ↓
Work Completed
    ↓
Payment Processed
```

### Contract features include:

- Contract creation
- Contract updates
- Contract acceptance
- Contract rejection
- Work submission
- Work approval
- Contract status tracking

---

# 💳 Payment System

KaushalSetu integrates payment functionality using **Razorpay**.

The platform supports payment-related workflows such as:

- Payment order creation
- Payment verification
- Payment tracking
- Client payments
- Organization payments
- Contract-related payments
- Escrow payment workflows
- Payment history management

---

# 💰 Wallet Management

The platform includes wallet functionality for tracking worker financial activity.

### Wallet features include:

- Wallet balance
- Transaction tracking
- Payment history
- Wallet transactions
- Withdrawal-related functionality

---

# ⭐ Reviews and Ratings

KaushalSetu includes a review system to help build trust between users.

Features include:

- Submit reviews
- View reviews
- Worker ratings
- Professional reputation tracking

This helps clients and organizations evaluate workers based on their previous interactions and work.

---

# 🤖 KaushalBot – AI Assistant

KaushalSetu includes an AI-powered assistant called **KaushalBot**.

KaushalBot helps users with:

- Finding suitable jobs
- Understanding job applications
- Contract-related questions
- Payment-related guidance
- KYC guidance
- Profile setup
- Skill-related questions
- General platform guidance

The AI functionality is integrated using the **Google Gemini API**.

---

# 🛠️ Technology Stack

## 🎨 Frontend

- React 19
- Vite
- React Router
- Axios
- Bootstrap
- React Bootstrap
- React Toastify
- Yup
- JWT Decode
- Lucide React
- React Icons

## ⚙️ Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven
- Lombok
- ModelMapper
- Spring Mail
- Razorpay
- Springdoc OpenAPI
- WebSocket

## 🗄️ Database

- MySQL

## 🤖 AI

- Google Gemini API

---

# 🏗️ System Architecture

```text
┌───────────────────────────────┐
│       React + Vite Frontend   │
│                               │
│  Worker • Client • Org • Admin│
└───────────────┬───────────────┘
                │
                │ REST API + JWT
                ▼
┌───────────────────────────────┐
│       Spring Boot Backend     │
│                               │
│ Auth • Jobs • KYC             │
│ Contracts • Payments          │
│ Wallet • Reviews              │
│ Notifications • Admin         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│             MySQL             │
└───────────────────────────────┘
```

---

# 📁 Project Structure

```text
KaushalSetu/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   ├── shared/
│   │   ├── services/
│   │   ├── routes/
│   │   └── store/
│   │
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 📡 Major Platform Modules

| Module | Description |
|---|---|
| 🔐 Authentication | Login, registration, JWT, OTP, email verification |
| 👷 Worker | Profile, skills, certificates and job management |
| 💼 Jobs | Job posting, browsing and management |
| 📝 Applications | Worker job applications and application tracking |
| 🪪 KYC | Worker identity and document verification |
| 📄 Contracts | Digital contract creation and management |
| 💳 Payments | Razorpay payment processing and verification |
| 💰 Wallet | Balance and transaction management |
| ⭐ Reviews | Ratings and review system |
| 🔔 Notifications | User notifications |
| 🛡️ Admin | Platform monitoring and management |
| 🤖 KaushalBot | AI-powered user assistance |

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have the following installed:

- Java 21
- Node.js
- npm
- MySQL
- Git

---

## 📥 Clone the Repository

```bash
git clone https://github.com/Rahulfev/KaushalSetu.git
```

Navigate to the project:

```bash
cd KaushalSetu
```

---

# 🖥️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your database in:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/kaushalsetudb
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Run the backend.

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local application URL in the terminal.

---

# 🔐 Environment Variables

⚠️ **Never commit real passwords, API keys, JWT secrets, email credentials, or payment keys to GitHub.**

Example `.gitignore`:

```gitignore
# Environment variables
.env
.env.*

# Java build files
target/
*.class

# IDE files
.idea/
.vscode/

# Logs
*.log
```

---

# 🔄 Application Workflow

```text
Worker Creates Profile
        ↓
Adds Skills & Certificates
        ↓
Completes KYC Verification
        ↓
Browses Available Jobs
        ↓
Applies for a Job
        ↓
Client / Organization Reviews Application
        ↓
Worker Selected
        ↓
Contract Created
        ↓
Work Completed
        ↓
Payment Processed
        ↓
Wallet Updated
        ↓
Review & Rating
```

---

# 🚀 Future Enhancements

- 📱 Mobile Application
- 🔔 Real-time Notifications
- 📍 Location-Based Job Recommendations
- 🤖 Advanced AI Job Matching
- 📊 Advanced Analytics
- 🌐 Multi-language Support
- ☁️ Cloud-based Document Storage
- 🔎 Improved Worker Recommendation System

---

# 👨‍💻 Author

**Rahul Singh**

---

# ⭐ Support

If you like this project, consider giving the repository a **Star ⭐**.

---

<div align="center">

## 🚀 KaushalSetu

### Connecting Skills with Opportunities

**Built with ❤️ using React, Spring Boot, MySQL, Razorpay, and Google Gemini AI**

</div>
