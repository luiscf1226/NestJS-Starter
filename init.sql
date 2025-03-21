CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (email, name, password) VALUES
    ('john@example.com', 'John Doe', '$2b$10$YourHashedPasswordHere'),
    ('jane@example.com', 'Jane Smith', '$2b$10$YourHashedPasswordHere'); 