-- drops db if already exists --
DROP DATABASE IF EXISTS employees_db;
-- creates a dabase called employees_db --
CREATE DATABASE employees_db;

-- use employees_db for the following --
USE employees_db;

CREATE TABLE department (
-- gives id a number for each row created --
id INT AUTO_INCREMENT NOT NULL,
-- creates a sring column --
name VARCHAR(30) NOT NULL,
-- sets id as the tables primary key --
PRIMARY KEY (id)
);

CREATE TABLE role (
-- gives id a number for each row created --
id INT AUTO_INCREMENT NOT NULL,
-- creates a sring column --
title VARCHAR(30) NOT NULL,
salary DECIMAL(10, 2) NOT NULL,
department_id INT NOT NULL,
-- connects other primary keys --
FOREIGN KEY (department_id) REFERENCES department (id),
-- sets id as the tables primary key --
PRIMARY KEY (id)
);

CREATE TABLE employee (
-- gives id a number for each row created --
id INT AUTO_INCREMENT NOT NULL,
-- creates a sring column --
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
-- connects other primary keys --
FOREIGN KEY (role_id) REFERENCES role (id),
FOREIGN KEY (manager_id) REFERENCES employee (id),
-- sets id as the tables primary key --
PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Software");

INSERT INTO role (title,salary,department_id)
VALUES ("Engineer",100000,1);