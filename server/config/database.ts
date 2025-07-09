import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_URL || "./data/scanner.db";
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Initialize database schema
export function initializeDatabase() {
  try {
    // Enable WAL mode for better concurrency
    db.pragma("journal_mode = WAL");

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        target_url TEXT NOT NULL,
        target_name TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        tools TEXT NOT NULL, -- JSON array of selected tools
        severity_filter TEXT, -- JSON array of severity levels
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        duration INTEGER, -- in seconds
        error_message TEXT,
        total_vulnerabilities INTEGER DEFAULT 0,
        critical_count INTEGER DEFAULT 0,
        high_count INTEGER DEFAULT 0,
        medium_count INTEGER DEFAULT 0,
        low_count INTEGER DEFAULT 0,
        info_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS vulnerabilities (
        id TEXT PRIMARY KEY,
        scan_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT NOT NULL,
        cvss REAL,
        cve TEXT,
        url TEXT NOT NULL,
        method TEXT,
        evidence TEXT,
        tags TEXT, -- JSON array
        template_id TEXT,
        template_name TEXT,
        reference TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scan_id) REFERENCES scans (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ai_analyses (
        id TEXT PRIMARY KEY,
        scan_id TEXT NOT NULL UNIQUE,
        summary TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        recommendations TEXT NOT NULL, -- JSON array
        risk_factors TEXT NOT NULL, -- JSON array
        estimated_fix_time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scan_id) REFERENCES scans (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS scan_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id TEXT NOT NULL,
        level TEXT NOT NULL, -- info, warning, error
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scan_id) REFERENCES scans (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
      CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at);
      CREATE INDEX IF NOT EXISTS idx_vulnerabilities_scan_id ON vulnerabilities(scan_id);
      CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
      CREATE INDEX IF NOT EXISTS idx_scan_logs_scan_id ON scan_logs(scan_id);
    `);

    // Initialize queries after tables are created
    initializeQueries();

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

// Lazy initialization of database queries
let _scanQueries: any = null;
let _vulnerabilityQueries: any = null;
let _aiAnalysisQueries: any = null;
let _logQueries: any = null;
let _queriesInitialized = false;

function initializeQueries() {
  try {
    _scanQueries = {
      create: db.prepare(`
        INSERT INTO scans (id, target_url, target_name, status, tools, severity_filter)
        VALUES (?, ?, ?, ?, ?, ?)
      `),

      findById: db.prepare("SELECT * FROM scans WHERE id = ?"),

      updateStatus: db.prepare(`
        UPDATE scans SET status = ?, started_at = CASE WHEN ? = 'running' THEN CURRENT_TIMESTAMP ELSE started_at END,
        completed_at = CASE WHEN ? IN ('completed', 'failed') THEN CURRENT_TIMESTAMP ELSE completed_at END
        WHERE id = ?
      `),

      updateStats: db.prepare(`
        UPDATE scans SET
          total_vulnerabilities = ?, critical_count = ?, high_count = ?,
          medium_count = ?, low_count = ?, info_count = ?, duration = ?
        WHERE id = ?
      `),

      setError: db.prepare(
        'UPDATE scans SET status = "failed", error_message = ? WHERE id = ?',
      ),

      getRecent: db.prepare(
        "SELECT * FROM scans ORDER BY created_at DESC LIMIT ?",
      ),

      getActive: db.prepare(
        'SELECT * FROM scans WHERE status IN ("pending", "running")',
      ),
    };

    _vulnerabilityQueries = {
      create: db.prepare(`
        INSERT INTO vulnerabilities (
          id, scan_id, title, description, severity, cvss, cve, url, method,
          evidence, tags, template_id, template_name, reference
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `),

      findByScanId: db.prepare(
        "SELECT * FROM vulnerabilities WHERE scan_id = ? ORDER BY severity DESC",
      ),

      countBySeverity: db.prepare(`
        SELECT severity, COUNT(*) as count
        FROM vulnerabilities WHERE scan_id = ?
        GROUP BY severity
      `),
    };

    _aiAnalysisQueries = {
      create: db.prepare(`
        INSERT INTO ai_analyses (id, scan_id, summary, risk_score, recommendations, risk_factors, estimated_fix_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `),

      findByScanId: db.prepare("SELECT * FROM ai_analyses WHERE scan_id = ?"),
    };

    _logQueries = {
      create: db.prepare(`
        INSERT INTO scan_logs (scan_id, level, message) VALUES (?, ?, ?)
      `),

      findByScanId: db.prepare(`
        SELECT * FROM scan_logs WHERE scan_id = ? ORDER BY timestamp DESC LIMIT ?
      `),
    };

    _queriesInitialized = true;
  } catch (error) {
    console.warn("Database queries not initialized yet:", error.message);
  }
}

// Getter functions to safely access queries
export const scanQueries = new Proxy({} as any, {
  get(target, prop) {
    if (typeof prop === "symbol") {
      return undefined;
    }
    if (!_queriesInitialized || !_scanQueries) {
      console.error(
        "Database access attempted before initialization for scanQueries." +
          String(prop),
      );
      throw new Error(
        "Database not initialized. Call initializeDatabase() first.",
      );
    }
    if (!_scanQueries[prop]) {
      console.error(`Query method '${String(prop)}' not found in scanQueries`);
      throw new Error(`Query method '${String(prop)}' not found`);
    }
    return _scanQueries[prop];
  },
});

export const vulnerabilityQueries = new Proxy({} as any, {
  get(target, prop) {
    if (!_queriesInitialized || !_vulnerabilityQueries) {
      console.error(
        "Database access attempted before initialization for vulnerabilityQueries." +
          prop,
      );
      throw new Error(
        "Database not initialized. Call initializeDatabase() first.",
      );
    }
    if (!_vulnerabilityQueries[prop]) {
      console.error(
        `Query method '${String(prop)}' not found in vulnerabilityQueries`,
      );
      throw new Error(`Query method '${String(prop)}' not found`);
    }
    return _vulnerabilityQueries[prop];
  },
});

export const aiAnalysisQueries = new Proxy({} as any, {
  get(target, prop) {
    if (!_queriesInitialized || !_aiAnalysisQueries) {
      console.error(
        "Database access attempted before initialization for aiAnalysisQueries." +
          prop,
      );
      throw new Error(
        "Database not initialized. Call initializeDatabase() first.",
      );
    }
    if (!_aiAnalysisQueries[prop]) {
      console.error(
        `Query method '${String(prop)}' not found in aiAnalysisQueries`,
      );
      throw new Error(`Query method '${String(prop)}' not found`);
    }
    return _aiAnalysisQueries[prop];
  },
});

export const logQueries = new Proxy({} as any, {
  get(target, prop) {
    if (!_queriesInitialized || !_logQueries) {
      console.error(
        "Database access attempted before initialization for logQueries." +
          prop,
      );
      throw new Error(
        "Database not initialized. Call initializeDatabase() first.",
      );
    }
    if (!_logQueries[prop]) {
      console.error(`Query method '${String(prop)}' not found in logQueries`);
      throw new Error(`Query method '${String(prop)}' not found`);
    }
    return _logQueries[prop];
  },
});
