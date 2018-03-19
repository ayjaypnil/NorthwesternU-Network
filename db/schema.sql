CREATE DATABASE nw_db;
USE nw_db;

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
	first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
	campus varchar(255) NOT NULL,
	grad_date varchar(255) NOT NULL,
	site_link varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE events
(
	id int NOT NULL AUTO_INCREMENT,
	poster_email varchar(255) NOT NULL,
	event_name varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
	posted_by varchar(255) NOT NULL,
	date varchar(255) NOT NULL,
	details varchar(255) NOT NULL,
	PRIMARY KEY (id)
);