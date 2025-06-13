# CarRentalConnect

A modern car rental web application for Tinghir, Morocco. Built with React, TypeScript, Spring Boot, and MySQL.

## 🚗 Project Description
CarRentalConnect allows users to browse, reserve, and manage car rentals online. Admins can manage cars, users, reservations, and view analytics.

## ✨ Features
- User registration, login, and profile management
- Browse and search cars by type, brand, and location
- Make, view, and cancel reservations
- Download reservation invoices (PDF)
- Admin dashboard: manage users, cars, reservations, and view statistics
- Responsive, modern UI

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Spring Boot, Java
- **Database:** MySQL
- **Other:** React Router, Sonner (toasts), jsPDF (PDF export)

## ⚡ Setup Instructions

### 1. Backend (Spring Boot)
- Install Java 17+ and Maven
- Configure your MySQL database and update `application.properties`
- Run:
  ```bash
  mvn spring-boot:run
  ```
- Backend runs on `http://localhost:8080`

### 2. Frontend (React)
- Install Node.js 18+
- In the `src` folder, run:
  ```bash
  npm install
  npm start
  ```
- Frontend runs on `http://localhost:8081`

## 📄 Usage
- Register or log in as a user
- Browse cars and make reservations
- Admin: log in as `admin@admin.com` to access the admin dashboard

---

_CarRentalConnect - Projet de fin d'année universitaire_
