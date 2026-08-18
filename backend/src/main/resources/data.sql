-- Auto-seed roles on startup (safe, skips if already exists)
INSERT IGNORE INTO roles (role_name) VALUES ('WORKER');
INSERT IGNORE INTO roles (role_name) VALUES ('CLIENT');
INSERT IGNORE INTO roles (role_name) VALUES ('ADMIN');
INSERT IGNORE INTO roles (role_name) VALUES ('ORGANIZATION');
