// src/app/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private counter = 0;
  
  readonly activeToasts = this.toasts.asReadonly();
  
  show(message: string, type: Toast['type'] = 'info', duration = 5000): void {
    const id = ++this.counter;
    
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };
    
    this.toasts.update(current => [...current, toast]);
    
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }
  
  remove(id: number): void {
    this.toasts.update(current => 
      current.filter(toast => toast.id !== id)
    );
  }
}