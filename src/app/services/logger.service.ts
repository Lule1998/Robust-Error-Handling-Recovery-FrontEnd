// src/app/services/logger.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  userAgent?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };

  constructor(private http: HttpClient) {}

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  private log(level: LogEntry['level'], message: string, context?: Record<string, any>) {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Lokalno logiranje
    this.logToConsole(logEntry);

    // Logiranje na server (ako nije development)
    if (!environment.development) {
      this.sendToServer(logEntry);
    }

    // Sačuvaj u localStorage za debugging
    this.saveToLocalStorage(logEntry);
  }

  private logToConsole(entry: LogEntry): void {
    const formattedMessage = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(formattedMessage, entry.context);
        break;
      case 'warn':
        console.warn(formattedMessage, entry.context);
        break;
      case 'info':
        console.info(formattedMessage, entry.context);
        break;
      case 'debug':
        console.debug(formattedMessage, entry.context);
        break;
    }
  }

  private sendToServer(entry: LogEntry): void {
    // Simuliramo slanje na server - zamijenite sa stvarnim endpoint-om
    // this.http.post('/api/logs', entry).subscribe();
    console.log('Sending to server:', entry);
  }

  private saveToLocalStorage(entry: LogEntry): void {
    try {
      const logs = this.getStoredLogs();
      logs.push(entry);
      
      // Čuvaj samo posljednjih 100 logova
      if (logs.length > 100) {
        logs.shift();
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving log to localStorage:', error);
    }
  }

  getStoredLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem('app_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  clearStoredLogs(): void {
    localStorage.removeItem('app_logs');
  }
}