CREATE DATABASE IF NOT EXISTS taschenrechner;
USE taschenrechner;

DROP TABLE IF EXISTS CalculationHistory;

CREATE TABLE CalculationHistory (
    id INT AUTO_INCREMENT,
    expression VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
