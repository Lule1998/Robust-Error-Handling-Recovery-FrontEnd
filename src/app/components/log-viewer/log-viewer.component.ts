import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService, LogEntry } from '../../services/logger.service';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="log-viewer">
      <div class="log-header">
        <h2>Application Logs</h2>
        <div class="log-controls">
          <select [(ngModel)]="selectedLevel" class="level-select">
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <button (click)="clearLogs()" class="clear-button">
            Clear Logs
          </button>
        </div>
      </div>

      <div class="log-container">
        @for (log of filteredLogs; track log.timestamp) {
          <div class="log-entry" [ngClass]="log.level">
            <div class="log-timestamp">{{ log.timestamp | date:'medium' }}</div>
            <div class="log-level">{{ log.level.toUpperCase() }}</div>
            <div class="log-message">{{ log.message }}</div>
            @if (log.context) {
              <div class="log-context">
                <pre>{{ log.context | json }}</pre>
              </div>
            }
          </div>
        } @empty {
          <div class="no-logs">No logs found.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .log-viewer {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin: 1rem;
    }

    .log-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .log-header h2 {
        font-size: 1.5rem;
    color: #1f2937;
    font-weight: 600;
    margin: 0;
    }

    .log-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .level-select {
        padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background-color: white;
    color: #1f2937;
    font-size: 0.875rem;
    min-width: 120px;
    }

    .level-select:focus {
      border-color: #94a3b8;
    }

    .clear-button {
        padding: 0.5rem 1rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    }

    .clear-button:hover {
      background-color: #dc2626;
    }

    .log-container {
      max-height: 500px;
      overflow-y: auto;
      padding: 1rem;
    }

    .log-entry {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .log-entry.error {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
    }

    .log-entry.warn {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
    }

    .log-entry.info {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
    }

    .log-entry.debug {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
    }

    .log-timestamp {
      color: #64748b;
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .log-level {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .log-message {
      color: #1e293b;
    }

    .log-context {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background-color: #f8fafc;
      border-radius: 4px;
      overflow-x: auto;
    }

    .log-context pre {
      margin: 0;
      font-size: 0.75rem;
      color: #334155;
    }

    .no-logs {
        text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
    font-style: italic;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class LogViewerComponent implements OnInit {
  private loggerService = inject(LoggerService);
  
  protected logs: LogEntry[] = [];
  protected selectedLevel: string = 'all';

  ngOnInit(): void {
    this.logs = this.loggerService.getStoredLogs();
  }

  protected get filteredLogs(): LogEntry[] {
    if (this.selectedLevel === 'all') {
      return this.logs;
    }
    return this.logs.filter(log => log.level === this.selectedLevel);
  }

  protected clearLogs(): void {
    this.loggerService.clearStoredLogs();
    this.logs = [];
  }
}
