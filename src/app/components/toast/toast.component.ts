// src/app/components/toast/toast.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toasts(); track toast.id) {
        <div 
          class="toast" 
          [class]="toast.type"
          role="alert"
          (click)="removeToast(toast.id)"
        >
          <div class="toast-content">
            {{ toast.message }}
          </div>
          <button class="toast-close" aria-label="Close">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 350px;
    }

    .toast {
      padding: 1rem;
      border-radius: 4px;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
    }

    .toast-content {
      margin-right: 1rem;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
      color: currentColor;
      opacity: 0.5;
    }

    .toast-close:hover {
      opacity: 1;
    }

    .success {
      background-color: #c6f6d5;
      color: #2f855a;
    }

    .error {
      background-color: #fed7d7;
      color: #c53030;
    }

    .warning {
      background-color: #feebc8;
      color: #c05621;
    }

    .info {
      background-color: #bee3f8;
      color: #2b6cb0;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  protected toasts = this.toastService.activeToasts;

  protected removeToast(id: number): void {
    this.toastService.remove(id);
  }
}