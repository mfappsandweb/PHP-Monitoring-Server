# CREATE MONITORING DATABASE
CREATE DATABASE IF NOT EXISTS monitoring_server;
USE monitoring_server;

# CREATE TABLES
CREATE TABLE IF NOT EXISTS device_log (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hostname VARCHAR(64),
    system_name VARCHAR(64),
    system_version VARCHAR(64),
    uptime BIGINT,
    cpu_count TINYINT,
    cpu_usage NUMERIC(4, 1),
    memory_total BIGINT,
    memory_used BIGINT,
    memory_used_percent NUMERIC(4, 1),
    network_up FLOAT,
    network_down FLOAT,
    timestamp TIMESTAMP
);
CREATE TABLE IF NOT EXISTS device_drives(
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32),
    mount_point VARCHAR(32),
    type VARCHAR(16),
    total_size BIGINT,
    used_size BIGINT,
    used_percent NUMERIC(4, 1),
    timestamp TIMESTAMP,
    host_id BIGINT,
    FOREIGN KEY (host_id) REFERENCES device_log(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS users(
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(32),
    email VARCHAR(255)
);