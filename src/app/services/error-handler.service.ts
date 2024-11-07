import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly errorSignal = signal<ApiError | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly retryCountSignal = signal<number>(0);
  
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly retryCount = this.retryCountSignal.asReadonly();
  
  private readonly MAX_RETRIES = 3;

  constructor(private toastService: ToastService) {}
  
  handleError(error: HttpErrorResponse, path?: string): void {
    const apiError: ApiError = {
      message: this.getErrorMessage(error),
      statusCode: error.status,
      timestamp: new Date().toISOString(),
      path
    };
    
    this.errorSignal.set(apiError);
    this.loadingSignal.set(false);
    
    this.toastService.show(
      apiError.message,
      this.getToastType(error.status),
      7000
    );
  }
  
  private getToastType(status: number): 'error' | 'warning' | 'info' {
    if (status >= 500) return 'error';
    if (status >= 400) return 'warning';
    return 'info';
  }
  
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client Error: ${error.error.message}`;
    }
    return error.error?.message || 'Server Error. Please try again later.';
  }
  
  startLoading(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
  }
  
  stopLoading(): void {
    this.loadingSignal.set(false);
  }
  
  incrementRetry(): boolean {
    const currentRetries = this.retryCountSignal();
    if (currentRetries < this.MAX_RETRIES) {
      this.retryCountSignal.set(currentRetries + 1);
      return true;
    }
    return false;
  }
  
  resetRetries(): void {
    this.retryCountSignal.set(0);
  }
  
  clearError(): void {
    this.errorSignal.set(null);
  }
}