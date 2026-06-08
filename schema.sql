-- ============================================================
-- Database Schema: Scalable REST API with RBAC
-- Engine: MySQL 8+
-- ============================================================

CREATE DATABASE IF NOT EXISTS rbac_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rbac_db;

-- -------------------------------------------------------
-- Table: accounts_user
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts_user (
    id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    username      VARCHAR(150)    NOT NULL UNIQUE,
    email         VARCHAR(254)    NOT NULL UNIQUE,
    password      VARCHAR(128)    NOT NULL,          -- Django stores hashed value
    role          ENUM('admin','user') NOT NULL DEFAULT 'user',
    first_name    VARCHAR(150)    NOT NULL DEFAULT '',
    last_name     VARCHAR(150)    NOT NULL DEFAULT '',
    is_active     TINYINT(1)      NOT NULL DEFAULT 1,
    is_staff      TINYINT(1)      NOT NULL DEFAULT 0,
    is_superuser  TINYINT(1)      NOT NULL DEFAULT 0,
    date_joined   DATETIME(6)     NOT NULL,
    last_login    DATETIME(6)     NULL,
    updated_at    DATETIME(6)     NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: tasks_task
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks_task (
    id             INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    title          VARCHAR(255)    NOT NULL,
    description    TEXT            NOT NULL DEFAULT '',
    status         ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
    priority       ENUM('low','medium','high')        NOT NULL DEFAULT 'medium',
    assigned_to_id INT UNSIGNED    NULL,
    created_by_id  INT UNSIGNED    NOT NULL,
    created_at     DATETIME(6)     NOT NULL,
    updated_at     DATETIME(6)     NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_task_status   (status),
    INDEX idx_task_priority (priority),
    INDEX idx_task_created  (created_at),
    CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to_id)
        REFERENCES accounts_user(id) ON DELETE SET NULL,
    CONSTRAINT fk_task_created_by  FOREIGN KEY (created_by_id)
        REFERENCES accounts_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: token_blacklist_outstandingtoken  (simplejwt)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS token_blacklist_outstandingtoken (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    token       LONGTEXT        NOT NULL,
    jti         VARCHAR(255)    NOT NULL UNIQUE,
    created_at  DATETIME(6)     NULL,
    expires_at  DATETIME(6)     NOT NULL,
    user_id     INT UNSIGNED    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_outstanding_user FOREIGN KEY (user_id)
        REFERENCES accounts_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: token_blacklist_blacklistedtoken  (simplejwt)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS token_blacklist_blacklistedtoken (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    blacklisted_at      DATETIME(6)     NOT NULL,
    token_id            BIGINT UNSIGNED NOT NULL UNIQUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_blacklisted_token FOREIGN KEY (token_id)
        REFERENCES token_blacklist_outstandingtoken(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
