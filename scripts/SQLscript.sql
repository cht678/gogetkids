-- DROP statements
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS schools;

-- Students
CREATE TABLE IF NOT EXISTS students (
  --id VARCHAR(255) PRIMARY KEY,
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  dateofbirth DATE NOT NULL,
  address VARCHAR(255) NOT NULL,
  postalcode VARCHAR (6) NOT NULL,
  class_id VARCHAR(255),
  parent_id VARCHAR(255)
);

-- Parents
CREATE TABLE IF NOT EXISTS parents (
  --id VARCHAR(255) PRIMARY KEY,
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  country_code VARCHAR(5),
  phone VARCHAR(20)
);

-- Teachers
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  country_code VARCHAR(5) NOT NULL,
  phone VARCHAR(20)
);

-- Schools
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(25) UNIQUE PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level VARCHAR(255) NOT NULL,
  teacher_id VARCHAR(255)
);

---------------------------------------------- SAMPLE DATA ----------------------------------------------------------------------
INSERT INTO students (firstname, lastname, dateofbirth, address, postalcode, class_id, parent_id)
VALUES ('John', 'Doe', '2000-01-01', '123 Main St', '123456', 'TC1', '1');

INSERT INTO parents (firstname, lastname, username, password, country_code, phone)
VALUES ('Jane', 'Doe', 'jane.doe@gmail.com', 'password123', '+65', '96969696');

INSERT INTO teachers (firstname, lastname, username, password, country_code, phone)
VALUES ('Robert', 'Smith', 'robert.smith@gmail.com', 'securepass', '+65', '9999 6666');

INSERT INTO schools (name, address)
VALUES ('Test School', '456 School Ave');

INSERT INTO classes (id, name, level, teacher_id)
VALUES ('TC1', 'TestClass1', 'P1', '1');
