DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products
(
item_id int auto_increment not null,
product_name varchar(100) not null,
department_name varchar(100) not null,
price double(6,2) not null,
stock_quantity int(10),
Primary Key (item_id));

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Pathfinder Roleplaying Game: Advanced Race Guide Pocket Edition","Books",15.00,10),
("YI Lite Action Camera","Electronics",57.99,19),("The Hitchhiker's Guide to the Galaxy","Books",19.99,42),
("Repel Windproof Travel Umbrella with Teflon Coating","Clothing",23.95,5),("Men's Leather Belt","Clothing",59.99,20),
("My Pillow Pet Duck","Toys & Games",14.99,4),("How to Train Your Dragon","Movies",14.99,7),("Good Omens", "Books",8.99,20),("Kingdom Hearts 3","Video Games",59.99,10),
("Puerto Rico Boardgame","Toys & Games", 49.99,5);
