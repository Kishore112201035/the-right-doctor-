import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <h1><a routerLink="/">People Manager</a></h1>
        </div>
        <nav class="main-nav">
          <ul>
            <li>
              <a 
                routerLink="/people" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{exact: true}"
              >
                People List
              </a>
            </li>
            <li>
              <a 
                routerLink="/people/new" 
                routerLinkActive="active"
              >
                Add Person
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--primary-color);
      color: white;
      padding: calc(var(--spacing-unit) * 2) 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .logo a {
      color: white;
      text-decoration: none;
    }
    
    .main-nav ul {
      display: flex;
      list-style: none;
    }
    
    .main-nav li:not(:last-child) {
      margin-right: calc(var(--spacing-unit) * 3);
    }
    
    .main-nav a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 500;
      padding: calc(var(--spacing-unit)) 0;
      transition: all 0.2s ease;
      position: relative;
    }
    
    .main-nav a:hover, .main-nav a.active {
      color: white;
    }
    
    .main-nav a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: white;
    }
    
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        gap: calc(var(--spacing-unit) * 2);
      }
      
      .main-nav ul {
        gap: calc(var(--spacing-unit) * 2);
      }
    }
  `]
})
export class HeaderComponent {}