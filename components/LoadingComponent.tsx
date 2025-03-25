import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertTriangle, ServerCrash } from 'lucide-react';

// Comprehensive Loading States
const LoadingStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Advanced Loading Component
const LoadingComponent = ({ 
  status = LoadingStates.LOADING, 
  loadingText = 'Loading ContactsHub...',
  errorText = 'Something went wrong',
  successText = 'Successfully loaded',
  onRetry = null,
  progressEnabled = true
}) => {
  const [progress, setProgress] = useState(0);

  // Intelligent progress simulation
  useEffect(() => {
    if (status === LoadingStates.LOADING) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(progressInterval);
    }
  }, [status]);

  // Render different icons based on status
  const renderStatusIcon = () => {
    const iconProps = { 
      className: "mx-auto mb-4 w-16 h-16 animate-pulse",
      strokeWidth: 1.5 
    };

    switch (status) {
      case LoadingStates.LOADING:
        return <Loader2 {...iconProps} className={`${iconProps.className} text-indigo-500 animate-spin`} />;
      case LoadingStates.SUCCESS:
        return <CheckCircle2 {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case LoadingStates.ERROR:
        return <ServerCrash {...iconProps} className={`${iconProps.className} text-red-500`} />;
      default:
        return null;
    }
  };

  // Dynamic background based on status
  const getBackgroundClass = () => {
    switch (status) {
      case LoadingStates.ERROR: 
        return "bg-red-50 dark:bg-red-900";
      case LoadingStates.SUCCESS: 
        return "bg-green-50 dark:bg-green-900";
      default:
        return "bg-gray-50 dark:bg-gray-900";
    }
  };

  // Dynamic text color based on status
  const getTextColorClass = () => {
    switch (status) {
      case LoadingStates.ERROR: 
        return "text-red-600 dark:text-red-300";
      case LoadingStates.SUCCESS: 
        return "text-green-600 dark:text-green-300";
      default:
        return "text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={status}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center min-h-screen ${getBackgroundClass()} transition-all duration-300`}
      >
        <div className="text-center w-full max-w-md px-6">
          {/* Animated Status Icon */}
          {renderStatusIcon()}

          {/* Progress Bar */}
          {progressEnabled && status === LoadingStates.LOADING && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-indigo-500 h-1.5 rounded-full"
              />
            </div>
          )}

          {/* Dynamic Status Message */}
          <p className={`text-lg font-medium ${getTextColorClass()} transition-colors`}>
            {status === LoadingStates.LOADING ? loadingText :
             status === LoadingStates.SUCCESS ? successText :
             status === LoadingStates.ERROR ? errorText : ''}
          </p>

          {/* Error Retry Mechanism */}
          {status === LoadingStates.ERROR && onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              <AlertTriangle className="inline-block mr-2 -mt-1" size={18} />
              Retry
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingComponent;