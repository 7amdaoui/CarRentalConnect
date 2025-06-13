-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tinghir_location_db;
USE tinghir_location_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    status ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    price_per_day DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample admin user
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Admin', 'User', 'admin@tinghircarrental.com', '$2a$10$yfPdwh8JzjnLLy.0EoDgWu6NL22zI1CUfhALaAXr9eQpgP7VEcP9i', '+212666123456', 'ADMIN')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample car types
INSERT INTO cars (brand, model, year, registration_number, type, agency, status, price_per_day, image_url) VALUES
('Dacia', 'Duster', 2023, '123456-A-5', 'SUV', 'Tinghir', 'AVAILABLE', 350.00, 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1974&auto=format&fit=crop'),
('Renault', 'Clio', 2022, '987654-B-7', 'Economique', 'Tinghir', 'AVAILABLE', 250.00, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1936&auto=format&fit=crop'),
('Hyundai', 'Tucson', 2023, '456123-C-2', 'SUV', 'Ouarzazate', 'AVAILABLE', 400.00, 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2070&auto=format&fit=crop'),
('Toyota', 'Hilux', 2022, '789012-D-1', 'SUV', 'Errachidia', 'AVAILABLE', 500.00, 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1974&auto=format&fit=crop'),
('Fiat', 'Tipo', 2021, '654321-E-3', 'Berline', 'Tinghir', 'AVAILABLE', 300.00, 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?q=80&w=2070&auto=format&fit=crop'),
('Peugeot', 'Partner', 2022, '951753-F-8', 'Utilitaire', 'Merzouga', 'AVAILABLE', 400.00, 'https://images.unsplash.com/photo-1617469767053-36efda1f5b75?q=80&w=1974&auto=format&fit=crop'),
('Citroën', 'C3', 2023, '357159-G-4', 'Economique', 'Ouarzazate', 'AVAILABLE', 280.00, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop'),
('Ford', 'Ranger', 2021, '852741-H-6', 'SUV', 'Errachidia', 'AVAILABLE', 550.00, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop')
ON DUPLICATE KEY UPDATE registration_number = registration_number; 