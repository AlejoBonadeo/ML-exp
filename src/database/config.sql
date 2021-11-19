CREATE DATABASE mercado_libros_alt;

USE mercado_libros_alt;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(60) NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    province VARCHAR(20) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE books(
    id INT NOT NULL AUTO_INCREMENT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    title VARCHAR(60) NOT NULL,
    author VARCHAR(60) NOT NULL,
    publisher VARCHAR(60) NOT NULL,
    category VARCHAR(60) NOT NULL,
    price INT NOT NULL,
    isUsed TINYINT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    sellerId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(sellerId)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE user_book(
    id INT NOT NULL AUTO_INCREMENT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    userId INT NOT NULL,
    bookId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) 
    REFERENCES users(id)
    ON DELETE CASCADE,
    FOREIGN KEY(bookId) 
    REFERENCES books(id)
    ON DELETE CASCADE
);