// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { ToastComponent } from './components/toast/toast.component';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UsersComponent, ToastComponent, LogViewerComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Error Handling Demo</h1>
      </header>
      
      <main class="main-content">
        <app-users />
        <app-log-viewer />
      </main>
      
      <app-toast />
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f7fafc;
    }

    .app-header {
      background-color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .app-header h1 {
      max-width: 1200px;
      margin: 0 auto;
      color: #2d3748;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: grid;
      gap: 2rem;
    }
  `]
})
export class AppComponent {}