// components/BalanceWidget.js
import React, { useState } from 'react';
import styles from './BalanceWidget.module.css';
import { motion } from 'framer-motion';

const BalanceWidget = () => {
  const [balance, setBalance] = useState(120.50);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddBalance = () => {
    setBalance(prev => prev + 50);
  };

  return (
    <motion.div 
      className={styles.widget}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Available Balance</p>
          <motion.h2 
            className={styles.balance}
            key={balance}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ${balance.toFixed(2)}
          </motion.h2>
        </div>
        <div className={styles.currencyBadge}>USD</div>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className={styles.summaryContent}>
            <p className={styles.summaryLabel}>Today</p>
            <p className={styles.amountNegative}>- $120.89</p>
          </div>
        </div>
        
        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 10h18M3 14h18M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2"/>
            </svg>
          </div>
          <div className={styles.summaryContent}>
            <p className={styles.summaryLabel}>Last 7 days</p>
            <p className={styles.amountNegative}>- $2,222.22</p>
          </div>
        </div>
      </div>
      
      <motion.button 
        className={styles.button}
        onClick={handleAddBalance}
        whileHover={{ 
          scale: 1.03,
          backgroundColor: '#3b82f6',
          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
        }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        + Add Funds
        <motion.span 
          className={styles.buttonIcon}
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      </motion.button>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressLabels}>
          <span>Spending limit</span>
          <span>${balance.toFixed(2)} / $500</span>
        </div>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${(balance / 500) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className={styles.decorative}>
        <div className={styles.decorativeCircle}></div>
        <div className={styles.decorativeCircle}></div>
      </div>
    </motion.div>
  );
};

export default BalanceWidget;