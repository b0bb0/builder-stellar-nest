import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Shield, Zap } from "lucide-react";

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Scanner",
      icon: Home,
      description: "Main Scanner Interface",
    },
    {
      path: "/advanced",
      label: "Advanced Platform",
      icon: Shield,
      description: "Advanced Vulnerability Assessment",
    },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        className="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-lg rounded-full border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg"
                    layoutId="activeBackground"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="relative flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">
                    {item.label}
                  </span>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {item.description}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
};
