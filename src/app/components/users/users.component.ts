import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDisplayComponent } from '../error-display/error-display.component';
import { UsersService } from '../../services/users.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

interface User {
  _id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ErrorDisplayComponent],
  template: `
    <div class="users-container">
      <h2 class="section-title">Users List</h2>
      
      <div class="button-group">
        <button (click)="loadUsers('success')" class="button success">
          Load Users (Success)
        </button>
        <button (click)="loadUsers('error404')" class="button warning">
          Load Users (404)
        </button>
        <button (click)="loadUsers('error500')" class="button danger">
          Load Users (500)
        </button>
        <button (click)="loadUsers('networkError')" class="button network-error">
          Load Users (Network Error)
        </button>
      </div>

      <app-error-display />

      @if (loading()) {
        <div class="loading">
          <span class="loading-text">Loading users...</span>
        </div>
      }

      @if (users.length > 0) {
        <div class="users-grid">
          @for (user of users; track user._id) {
            <div class="user-card">
              <h3 class="user-name">{{ user.name }}</h3>
              <p class="user-email">{{ user.email }}</p>
            </div>
          }
        </div>
      } @else if (!loading()) {
        <div class="no-users">
          <p>No users found. Click Load Users to fetch data.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .users-container {
      padding: 1.5rem;
      background-color: #f8fafc;
      border-radius: 8px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      color: #1f2937;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .button-group {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .button {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .button:active {
      transform: translateY(0);
    }

    .success {
      background-color: #48bb78;
    }

    .success:hover {
      background-color: #38a169;
    }

    .warning {
      background-color: #ed8936;
    }

    .warning:hover {
      background-color: #dd6b20;
    }

    .danger {
      background-color: #f56565;
    }

    .danger:hover {
      background-color: #e53e3e;
    }

    .network-error {
      background-color: #9f7aea;
    }

    .network-error:hover {
      background-color: #805ad5;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      background-color: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .loading-text {
      color: #4a5568;
      font-size: 1rem;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .user-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .user-name {
      color: #1f2937;
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .user-email {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    .no-users {
      text-align: center;
      padding: 3rem 1rem;
      background-color: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      color: #6b7280;
    }

    @media (max-width: 640px) {
      .users-container {
        padding: 1rem;
      }

      .button-group {
        flex-direction: column;
      }

      .button {
        width: 100%;
      }

      .users-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);
  private errorHandler = inject(ErrorHandlerService);

  protected users: User[] = [];
  protected loading = this.errorHandler.loading;

  ngOnInit(): void {
    // Učitaj korisnike pri inicijalizaciji
    this.loadUsers('success');
  }

  protected loadUsers(errorType: 'success' | 'error404' | 'error500' | 'networkError' = 'success'): void {
    this.users = [];
    
    this.usersService.getUsersWithError(errorType).subscribe({
      next: (response: any) => {
        if (response?.data?.users) {
          this.users = response.data.users;
        } else if (Array.isArray(response)) {
          this.users = response;
        }
        this.errorHandler.stopLoading();
      }
      // Error handling je implementiran kroz interceptor
    });
  }
}
