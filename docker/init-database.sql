-- Fusion Scanner Database Initialization
-- =====================================

-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 2000;
PRAGMA temp_store = memory;
PRAGMA mmap_size = 268435456;

-- Create main tables
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_scan_id ON vulnerabilities(scan_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scan_id ON scan_logs(scan_id);

-- Insert sample demo data
INSERT OR REPLACE INTO scans (
  id, target_url, target_name, status, tools, severity_filter,
  created_at, started_at, completed_at, duration,
  total_vulnerabilities, critical_count, high_count, medium_count, low_count, info_count
) VALUES 
(
  'demo-scan-001',
  'https://demo.testfire.net',
  'Demo Banking Application',
  'completed',
  '["nuclei", "basic"]',
  '["critical", "high", "medium", "low", "info"]',
  datetime('now', '-1 hour'),
  datetime('now', '-55 minutes'),
  datetime('now', '-30 minutes'),
  1500,
  5, 1, 2, 1, 1, 0
),
(
  'demo-scan-002',
  'https://httpbin.org',
  'HTTPBin Test Service',
  'completed',
  '["basic"]',
  '["medium", "low", "info"]',
  datetime('now', '-2 hours'),
  datetime('now', '-115 minutes'),
  datetime('now', '-110 minutes'),
  300,
  3, 0, 0, 2, 1, 0
);

-- Insert sample vulnerabilities
INSERT OR REPLACE INTO vulnerabilities (
  id, scan_id, title, description, severity, cvss, cve, url, method,
  evidence, tags, template_id, template_name, reference
) VALUES 
(
  'vuln-001',
  'demo-scan-001',
  'SQL Injection Vulnerability',
  'The application is vulnerable to SQL injection attacks through the login form.',
  'critical',
  9.3,
  'CVE-2023-12345',
  'https://demo.testfire.net/login.jsp',
  'POST',
  'Parameter: username, Payload: '' OR 1=1 --',
  '["sql-injection", "authentication", "web"]',
  'sql-injection-login',
  'SQL Injection - Login Form',
  'https://owasp.org/www-community/attacks/SQL_Injection'
),
(
  'vuln-002',
  'demo-scan-001',
  'Cross-Site Scripting (XSS)',
  'Reflected XSS vulnerability in search functionality.',
  'high',
  7.5,
  'CVE-2023-12346',
  'https://demo.testfire.net/search.jsp',
  'GET',
  'Parameter: query, Payload: <script>alert(1)</script>',
  '["xss", "javascript", "web"]',
  'xss-reflected',
  'Reflected XSS - Search',
  'https://owasp.org/www-community/attacks/xss/'
),
(
  'vuln-003',
  'demo-scan-001',
  'Insecure Direct Object Reference',
  'User can access other users'' account information by modifying account ID.',
  'high',
  6.8,
  NULL,
  'https://demo.testfire.net/bank/account.jsp?id=123',
  'GET',
  'Unauthorized access to account ID 123',
  '["idor", "authorization", "web"]',
  'idor-account',
  'IDOR - Account Access',
  'https://owasp.org/www-community/attacks/Insecure_Direct_Object_References'
),
(
  'vuln-004',
  'demo-scan-001',
  'Weak Password Policy',
  'The application allows weak passwords without complexity requirements.',
  'medium',
  4.2,
  NULL,
  'https://demo.testfire.net/register.jsp',
  'POST',
  'Password "123456" accepted during registration',
  '["authentication", "password", "policy"]',
  'weak-password',
  'Weak Password Policy',
  'https://owasp.org/www-community/controls/Authentication'
),
(
  'vuln-005',
  'demo-scan-001',
  'Information Disclosure',
  'Server version information disclosed in HTTP headers.',
  'low',
  2.1,
  NULL,
  'https://demo.testfire.net',
  'GET',
  'Server: Apache/2.4.41 (Ubuntu)',
  '["information-disclosure", "headers"]',
  'server-version',
  'Server Version Disclosure',
  'https://owasp.org/www-community/vulnerabilities/Information_exposure_through_server_headers'
),
(
  'vuln-006',
  'demo-scan-002',
  'Missing Security Headers',
  'Important security headers are missing from HTTP responses.',
  'medium',
  3.5,
  NULL,
  'https://httpbin.org',
  'GET',
  'Missing: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection',
  '["headers", "security"]',
  'missing-headers',
  'Missing Security Headers',
  'https://owasp.org/www-project-secure-headers/'
),
(
  'vuln-007',
  'demo-scan-002',
  'Unencrypted Data Transmission',
  'Sensitive data transmitted over unencrypted HTTP connection.',
  'medium',
  4.0,
  NULL,
  'http://httpbin.org/post',
  'POST',
  'Data transmitted without HTTPS encryption',
  '["encryption", "transport", "http"]',
  'unencrypted-transmission',
  'Unencrypted Data Transmission',
  'https://owasp.org/www-community/vulnerabilities/Unencrypted_transmission_of_sensitive_information'
),
(
  'vuln-008',
  'demo-scan-002',
  'Verbose Error Messages',
  'Application returns detailed error messages that may leak sensitive information.',
  'low',
  2.8,
  NULL,
  'https://httpbin.org/status/500',
  'GET',
  'Internal server error with stack trace exposed',
  '["information-disclosure", "error-handling"]',
  'verbose-errors',
  'Verbose Error Messages',
  'https://owasp.org/www-community/Improper_Error_Handling'
);

-- Insert sample AI analyses
INSERT OR REPLACE INTO ai_analyses (
  id, scan_id, summary, risk_score, recommendations, risk_factors, estimated_fix_time
) VALUES 
(
  'ai-analysis-001',
  'demo-scan-001',
  'The target application shows multiple critical security vulnerabilities including SQL injection and XSS. Immediate remediation is required.',
  85,
  '["Implement parameterized queries to prevent SQL injection", "Add input validation and output encoding for XSS prevention", "Implement proper access controls for IDOR vulnerabilities", "Enforce strong password policies"]',
  '["Critical SQL injection allows data breach", "XSS enables session hijacking", "IDOR allows unauthorized data access", "Public-facing web application"]',
  '2-3 weeks'
),
(
  'ai-analysis-002',
  'demo-scan-002',
  'The target shows moderate security issues primarily related to configuration and headers. These issues should be addressed to improve security posture.',
  45,
  '["Implement proper security headers", "Enable HTTPS encryption", "Improve error handling to prevent information disclosure"]',
  '["Missing security headers increase attack surface", "Unencrypted transmission exposes data", "Verbose errors may leak sensitive information"]',
  '1 week'
);

-- Insert sample scan logs
INSERT OR REPLACE INTO scan_logs (scan_id, level, message) VALUES 
('demo-scan-001', 'info', 'Scan initiated for target: https://demo.testfire.net'),
('demo-scan-001', 'info', 'Starting Nuclei template scan'),
('demo-scan-001', 'warning', 'High severity vulnerability detected: SQL Injection'),
('demo-scan-001', 'warning', 'High severity vulnerability detected: XSS'),
('demo-scan-001', 'info', 'Basic security checks completed'),
('demo-scan-001', 'info', 'Scan completed successfully'),
('demo-scan-002', 'info', 'Scan initiated for target: https://httpbin.org'),
('demo-scan-002', 'info', 'Starting basic security checks'),
('demo-scan-002', 'warning', 'Security header issues detected'),
('demo-scan-002', 'info', 'Scan completed successfully');

-- Optimize database
ANALYZE;
VACUUM;
