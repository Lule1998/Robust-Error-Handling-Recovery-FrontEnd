// src/app/services/users.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  
  // Backend API URL
  private apiUrl = 'http://localhost:3000/api'; // Naš Node.js backend

  getUsers(): Observable<User[]> {
    this.errorHandler.startLoading();
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Test endpoints za demonstraciju različitih grešaka
  getUsersWithError(errorType: 'success' | 'error404' | 'error500' | 'networkError'): Observable<any> {
    this.errorHandler.startLoading();
    
    const endpoints = {
      success: '/users',
      error404: '/test/404',
      error500: '/test/500',
      networkError: '/test/network-error'
    };

    return this.http.get(`${this.apiUrl}${endpoints[errorType]}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}