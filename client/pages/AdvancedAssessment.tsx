import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  Globe,
  Target,
  ChevronDown,
  Play,
  AlertTriangle,
  Activity,
  TrendingUp,
  Lock,
  Cpu,
  Network,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Types for our data structures
interface ScanConfig {
  target: string;
  scanType: "comprehensive" | "quick" | "custom";
  priority: "normal" | "high" | "critical";
}

interface VulnerabilityStats {
  name: string;
  count: number;
  color: string;
}

// Sample data - replace with real API calls
const mockStats: VulnerabilityStats[] = [
  { name: "Crit", count: 3, color: "#ff006e" },
  { name: "High", count: 12, color: "#8338ec" },
  { name: "Med", count: 24, color: "#3a86ff" },
  { name: "Low", count: 18, color: "#06ffa5" },
  { name: "Info", count: 31, color: "#00f5ff" },
];

const AdvancedAssessmentPlatform: React.FC = () => {
  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    target: "",
    scanType: "comprehensive",
    priority: "normal",
  });

  const [riskScore, setRiskScore] = useState(68);
  const [scanProgress, setScanProgress] = useState(86);
  const [isScanning, setIsScanning] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    mobile: "",
    name: "",
    email: "",
    organization: "",
  });

  // Simulate dynamic risk score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScore((prev) => {
        const newScore = prev + (Math.random() - 0.5) * 4;
        return Math.max(0, Math.min(100, Math.round(newScore)));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartScan = () => {
    if (!scanConfig.target) {
      alert("Please enter a target URL or IP address");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scan progress - replace with real API call
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 500);

    // TODO: Replace with actual API call
    // startVulnerabilityScan(scanConfig).then(response => {
    //   // Handle scan initiation
    // });
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual registration API call
    console.log("Registration data:", registrationData);
    alert("Registration submitted! You'll receive access details shortly.");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #ff006e 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #8338ec 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.header
          className="text-center py-16 px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-blue-300 text-sm uppercase tracking-[0.3em] mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SECURITY PLATFORM
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Advanced{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-black">
              Vulnerability Assessment
            </span>{" "}
            Platform
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered LLM trained models for comprehensive security analysis
          </p>
        </motion.header>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Target Configuration Form - Full Width on Mobile */}
            <motion.div
              className="lg:col-span-2 p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Target className="w-8 h-8 text-cyan-400" />
                  Target Configuration
                </h2>

                <div className="space-y-6">
                  {/* Target URL/IP Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-100">
                      Target URL/IP Address
                    </label>
                    <input
                      type="text"
                      value={scanConfig.target}
                      onChange={(e) =>
                        setScanConfig({ ...scanConfig, target: e.target.value })
                      }
                      placeholder="https://example.com or 192.168.1.1"
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Scan Type and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-100">
                        Scan Type
                      </label>
                      <div className="relative">
                        <select
                          value={scanConfig.scanType}
                          onChange={(e) =>
                            setScanConfig({
                              ...scanConfig,
                              scanType: e.target.value as any,
                            })
                          }
                          className="w-full px-4 py-3 bg-black/30 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="comprehensive">
                            Comprehensive Scan
                          </option>
                          <option value="quick">Quick Scan</option>
                          <option value="custom">Custom Scan</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-cyan-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-100">
                        Priority Level
                      </label>
                      <div className="relative">
                        <select
                          value={scanConfig.priority}
                          onChange={(e) =>
                            setScanConfig({
                              ...scanConfig,
                              priority: e.target.value as any,
                            })
                          }
                          className="w-full px-4 py-3 bg-black/30 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="normal">Normal Priority</option>
                          <option value="high">High Priority</option>
                          <option value="critical">Critical Priority</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-cyan-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Scan Button */}
                  <motion.button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="relative w-full py-4 px-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

                    <div className="relative flex items-center justify-center gap-3">
                      {/* Triangular neon icon */}
                      <motion.div
                        className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white"
                        animate={isScanning ? { rotate: 360 } : {}}
                        transition={{
                          duration: 1,
                          repeat: isScanning ? Infinity : 0,
                        }}
                      />
                      {isScanning ? "SCANNING..." : "SCAN →"}
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Risk Score Widget */}
            <motion.div
              className="p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-pink-500/30 relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {/* Pulsing ring background */}
              <motion.div
                className="absolute inset-4 rounded-full border-4 border-pink-500/30"
                animate={{
                  borderColor: [
                    "rgba(236, 72, 153, 0.3)",
                    "rgba(236, 72, 153, 0.8)",
                    "rgba(236, 72, 153, 0.3)",
                  ],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative z-10 text-center">
                <div className="mb-6">
                  <motion.div
                    className="text-6xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {riskScore}
                  </motion.div>
                  <div className="text-gray-300 text-lg">Risk Score</div>
                </div>

                <motion.div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    riskScore >= 70
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : riskScore >= 40
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {riskScore >= 70
                    ? "HIGH RISK"
                    : riskScore >= 40
                      ? "MEDIUM RISK"
                      : "LOW RISK"}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Progress and Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Scan Progress Widget */}
            <motion.div
              className="p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-cyan-500/30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-cyan-400" />
                Scan Progress
              </h3>

              <div className="text-center mb-6">
                {/* Circular progress */}
                <div className="relative inline-block">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(6, 182, 212, 0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: scanProgress / 100 }}
                      transition={{ duration: 1 }}
                      style={{ filter: "drop-shadow(0 0 10px #06b6d4)" }}
                    />
                    <defs>
                      <linearGradient
                        id="progressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {Math.round(scanProgress)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 1 }}
                  style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                />
              </div>
            </motion.div>

            {/* Scan Statistics */}
            <motion.div
              className="p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Vulnerability Statistics
              </h3>

              <div className="h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockStats}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <YAxis hide />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {mockStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {mockStats.reduce((sum, stat) => sum + stat.count, 0)}
                </div>
                <div className="text-gray-400 text-sm">
                  Total Vulnerabilities Found
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Tiles */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              {
                icon: Shield,
                title: "Advanced Protection",
                description:
                  "Military-grade security algorithms with real-time threat detection",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                title: "Performance Optimized",
                description:
                  "Lightning-fast scans with minimal system resource usage",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Globe,
                title: "Global Coverage",
                description:
                  "Worldwide threat intelligence database with 24/7 monitoring",
                color: "from-green-500 to-blue-500",
              },
              {
                icon: Cpu,
                title: "AI-Powered Analysis",
                description:
                  "Machine learning models trained on millions of attack patterns",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Registration CTA */}
          <motion.section
            className="relative p-12 rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Register for Full Access
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Unlock advanced features and get comprehensive security
                  insights
                </p>
              </div>

              <form onSubmit={handleRegistration} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={registrationData.mobile}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        mobile: e.target.value,
                      })
                    }
                    className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registrationData.name}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        name: e.target.value,
                      })
                    }
                    className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={registrationData.email}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        email: e.target.value,
                      })
                    }
                    className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Organization"
                    value={registrationData.organization}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        organization: e.target.value,
                      })
                    }
                    className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-4 px-8 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-white/90 transition-all duration-300 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Get Full Access →</span>
                </motion.button>
              </form>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAssessmentPlatform;
