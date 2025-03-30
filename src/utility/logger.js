import winston from 'winston';
import 'winston-daily-rotate-file';
import dotenv from 'dotenv';
import {f} from './f.js'



// Configure daily log rotation
const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/%DATE%-server.log', // Log files stored in "logs/" directory
  datePattern: 'YYYY-MM-DD',         // Rotates logs daily, named by date
  maxFiles: '14d',                   // Keep logs for the last 14 days
});

// Create the Winston logger
const logger = winston.createLogger({
  level: 'info', // Log levels: info, error, warn, debug, etc.
  format: winston.format.combine(
    winston.format.timestamp(),      // Add timestamps to logs
    winston.format.json()            // Store logs in JSON format
  ),
  transports: [
    transport,                       // Log to daily files
    new winston.transports.Console(), // Log to console (optional for development)
  ],
});





export default logger;