// components/TopAppsWidget.js
import React from 'react';
import styles from './TopAppsWidget.module.css';
import { motion } from 'framer-motion';

const TopAppsWidget = () => {
  const apps = [
    { name: 'Taskwask', model: 'CPI', cr: '3.00%', progress: '360/500', value: 72 },
    { name: 'Zook', model: 'CPI', cr: '12.00%', progress: '10/100', value: 10 },
    { name: 'Taskbud', model: 'CPI', cr: '10%', progress: '100', value: 100 },
  ];

  // Color variants for progress bars
  const getProgressColor = (value) => {
    if (value >= 80) return styles.progressHigh;
    if (value >= 50) return styles.progressMedium;
    return styles.progressLow;
  };

  return (
    <motion.div 
      className={styles.widget}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Top Performing Apps</h3>
        <motion.a 
          href="#" 
          className={styles.link}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          View Campaigns
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.arrowIcon}>
            <path d="M5 12H19M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.a>
      </div>
      
      <div className={styles.tableHeader}>
        <div className={styles.colName}>App Name</div>
        <div className={styles.colModel}>Model</div>
        <div className={styles.colCr}>Conversion Rate</div>
        <div className={styles.colProgress}>Progress</div>
      </div>
      
      <div className={styles.appsList}>
        {apps.map((app, index) => (
          <motion.div 
            key={index}
            className={styles.appRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              backgroundColor: 'rgba(249, 250, 251, 0.8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div className={styles.appInfo}>
              <div className={styles.appIcon}>
                {app.name.charAt(0)}
              </div>
              <div className={styles.appName}>{app.name}</div>
            </div>
            
            <div className={styles.appModel}>
              <span className={styles.modelBadge}>{app.model}</span>
            </div>
            
            <div className={styles.appCr}>
              <span className={styles.crValue}>{app.cr}</span>
            </div>
            
            <div className={styles.appProgress}>
              <div className={styles.progressContainer}>
                <div className={`${styles.progressBar} ${getProgressColor(app.value)}`}>
                  <motion.div 
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${app.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className={styles.progressText}>{app.progress}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Avg. CR</span>
            <span className={styles.statValue}>8.33%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Installs</span>
            <span className={styles.statValue}>470</span>
          </div>
        </div>
        <button className={styles.exportButton}>
          Export Report
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.downloadIcon}>
            <path d="M12 16L12 8M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default TopAppsWidget;