// components/CampaignChart.js
import React, { useState } from 'react';
import styles from './CampaignChart.module.css';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';

const data = [
  { name: '13Dec', value: 16 },
  { name: '14Dec', value: 14 },
  { name: '15Dec', value: 18 },
  { name: '16Dec', value: 10 },
  { name: '17Dec', value: 9 },
  { name: '18Dec', value: 13 },
  { name: '19Dec', value: 17 },
  { name: '20Dec', value: 14 },
  { name: '21Dec', value: 16 },
  { name: '22Dec', value: 11 },
  { name: '23Dec', value: 13 },
];

const metrics = [
  { value: 13045, label: 'Clicks', change: '+12.6%', positive: true },
  { value: 122, label: 'Conversion (Today)', change: '+2.6%', positive: true },
  { value: 29, label: 'Cost/Conversion', change: '-12.6%', positive: false },
  { value: 98, label: 'Cost', change: '-12.6%', positive: false },
];

const CampaignChart = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <Box className={styles.widget}>
      <Box className={styles.header}>
        <Box>
          <Typography variant="overline" className={styles.subtitle}>
            Campaign Performance
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" className={styles.title}>
              Analytics Overview
            </Typography>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.select}
              variant="outlined"
              size="small"
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </Box>
        </Box>
        <Box className={styles.badge}>
          <Typography variant="caption">All Campaigns</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} className={styles.metrics}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              className={`${styles.metricCard} ${metric.positive ? styles.positive : styles.negative}`}
              elevation={0}
            >
              <CardContent>
                <Typography variant="h5" className={styles.metricValue}>
                  {metric.value.toLocaleString()}
                </Typography>
                <Typography variant="body2" className={styles.metricLabel}>
                  {metric.label}
                </Typography>
                <Typography 
                  variant="caption" 
                  className={`${styles.change} ${metric.positive ? styles.green : styles.red}`}
                >
                  {metric.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6a5af9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6a5af9" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke="#f5f5f5" 
              strokeDasharray="3 3" 
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9a9aaf' }}
            />
            <YAxis 
              domain={[0, 24]} 
              ticks={[0, 8, 16, 24]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9a9aaf' }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: '12px 16px',
                backdropFilter: 'blur(4px)',
                fontSize: '14px'
              }}
              itemStyle={{ color: '#6a5af9', fontWeight: 600 }}
              labelStyle={{ fontWeight: 600, color: '#33334d' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="none" 
              fillOpacity={1} 
              fill="url(#colorUv)" 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#6a5af9" 
              fill="transparent" 
              strokeWidth={3} 
              dot={{ 
                stroke: '#6a5af9', 
                strokeWidth: 3, 
                r: 4, 
                fill: '#ffffff',
                strokeOpacity: 0.8
              }} 
              activeDot={{ 
                r: 8, 
                stroke: '#ffffff', 
                strokeWidth: 3,
                fill: '#6a5af9'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default CampaignChart;