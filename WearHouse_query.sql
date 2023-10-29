CREATE DATABASE WearHouse
USE WearHouse
GO

CREATE TABLE Users (
	UserId UNIQUEIDENTIFIER PRIMARY KEY,
	"Name" VARCHAR(255) NOT NULL,
	Email VARCHAR(255) NOT NULL,
	"Password" VARCHAR(255) NOT NULL
);

GO


CREATE TABLE Categories (
	UserId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(UserId),
	CategoryId INT IDENTITY(1,1) PRIMARY KEY,
	CategoryName VARCHAR(255)
);

Go


DECLARE @UserUID UNIQUEIDENTIFIER;
SET @UserUID = NEWID();

INSERT INTO Users
VALUES (@UserUID, 'jovi', 'jovi@gmail.com', 'Qwe123!@#');

INSERT INTO Categories
VALUES (@UserUID, 'Baju'), (@UserUID, 'Sepatu'), (@UserUID, 'Celana'), (@UserUID, 'Topi'), (@UserUID, 'Perhiasan');
GO

DECLARE @UserUID UNIQUEIDENTIFIER;
SET @UserUID = NEWID();

INSERT INTO Users
VALUES (@UserUID, 'admin', 'admin@admin.com', 'Qwe123!@#');

INSERT INTO Categories
VALUES (@UserUID, 'Shirt'), (@UserUID, 'Leggings'), (@UserUID, 'Hoodie'), (@UserUID, 'Jacket'), (@UserUID, 'Sweater');
GO


SELECT *
FROM Users

SELECT *
FROM Categories

Go


-- Use for reset tables
DROP TABLE Categories, Users;

-- DROP DATABASE WearHouse
GO

