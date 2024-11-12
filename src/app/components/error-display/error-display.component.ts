import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (error()) {
      <div class="error-container" [ngClass]="getSeverityClass(error()?.statusCode)">
        <div class="error-header">
          <span class="error-status">Error {{ error()?.statusCode }}</span>
          <button class="close-button" (click)="clearError()">×</button>
        </div>
        <div class="error-body">
          <p class="error-message">{{ error()?.message }}</p>
          @if (isRetrying()) {
            <p class="retry-message">
              Retrying... Attempt {{ retryCount() }}/3
            </p>
          } @else {
            <button class="retry-button" (click)="onRetry()">
              Try Again
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .error-container {
      margin: 1rem 0;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error-header {
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .error-status {
      font-weight: bold;
    }

    .error-body {
      padding: 1rem;
    }

    .error-message {
      margin: 0 0 1rem;
    }

    .retry-message {
      font-style: italic;
      color: #666;
      margin: 0.5rem 0;
    }

    .retry-button {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: none;
      background-color: #4a5568;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .retry-button:hover {
      background-color: #2d3748;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0 0.5rem;
      color: inherit;
    }

    .error-critical {
      background-color: #fff5f5;
      border: 1px solid #fc8181;
      color: #c53030;
    }

    .error-warning {
      background-color: #fffaf0;
      border: 1px solid #fbd38d;
      color: #c05621;
    }

    .error-info {
      background-color: #ebf8ff;
      border: 1px solid #63b3ed;
      color: #2b6cb0;
    }
  `]
})
export class ErrorDisplayComponent {
  private errorHandler = inject(ErrorHandlerService);

  // Signali iz servisa
  protected error = this.errorHandler.error;
  protected retryCount = this.errorHandler.retryCount;

  protected isRetrying(): boolean {
    return this.retryCount() > 0 && this.retryCount() < 3;
  }

  protected getSeverityClass(statusCode: number | undefined): string {
    if (!statusCode) return 'error-info';
    if (statusCode >= 500) return 'error-critical';
    if (statusCode >= 400) return 'error-warning';
    return 'error-info';
  }

  protected onRetry(): void {
    this.errorHandler.resetRetries();
    this.errorHandler.clearError();
    // Ovdje možete emitovati event koji će komponenta roditelj uhvatiti
    // za ponovno slanje zahtjeva
  }

  protected clearError(): void {
    this.errorHandler.clearError();
  }
}
