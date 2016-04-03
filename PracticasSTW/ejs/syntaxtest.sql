CREATE TABLE Memos
(
	ID int PRIMARY KEY AUTO_INCREMENT,
	MemoName varchar(255) NOT NULL,
	MemoDesc mediumtext NOT NULL,
	MemoFile blob
)