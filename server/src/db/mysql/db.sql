DROP DATABASE IF EXISTS auth;
CREATE DATABASE auth;

USE auth;

DROP TABLE IF EXISTS passwd_auth;
CREATE TABLE passwd_auth (
    `cred_id` varchar(100) NOT NULL,
    `hash` varchar(64) NOT NULL,
    `salt` varchar(32) NOT NULL,
    PRIMARY KEY (`cred_id`)
);

DROP TABLE IF EXISTS user_info;
CREATE TABLE user_info (
    `cred_id` varchar(100) NOT NULL,
    `name` varchar(100) NOT NULL,
    `familyname` varchar(100),
    PRIMARY KEY (`cred_id`)
);

DROP TABLE IF EXISTS user_bound_credentials;
CREATE TABLE user_bound_credentials (
    `_id` varchar(100) NOT NULL,
    `credential_type` int UNSIGNED,
    `credential_info` varchar(100) NOT NULL,
    PRIMARY KEY (`_id`),
    UNIQUE KEY `user_binds_uniq` (`credential_type`, `credential_info`)
);

DROP TABLE IF EXISTS credentials_type;
CREATE TABLE credentials_type (
    `type` int UNSIGNED,
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`type`) 
);

CREATE VIEW v_userauth
AS 
    SELECT  p.hash  hash,
            p.salt  salt,
            u.id          username,
            u.name        name,
            u.familyname  familyname
    FROM passwd_auth p
           INNER JOIN user_info u ON p.id = u.id;

INSERT INTO credentials_type(`type`, `name`) VALUES(1, 'email');
INSERT INTO credentials_type(`type`, `name`) VALUES(2, 'phone');
INSERT INTO credentials_type(`type`, `name`) VALUES(3, 'mobile');