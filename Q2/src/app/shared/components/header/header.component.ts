import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>Person Manager</h1>
          </div>
          <nav class="nav">
            <ul>
              <li>
                <a 
                  routerLink="/person" 
                  routerLinkActive="active" 
                  [routerLinkActiveOptions]="{exact: true}"
                >
                  List
                </a>
              </li>
              <li>
                <a 
                  routerLink="/person/new" 
                  routerLinkActive="active"
                >
                  Add Person
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--primary-600);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .logo h1 {
      font-size: 1.5rem;
      margin: 0;
    }
    
    .nav ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
    }
    
    .nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.2s ease;
    }
    
    .nav a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: white;
      transition: width 0.3s ease;
    }
    
    .nav a:hover::after,
    .nav a.active::after {
      width: 100%;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .nav ul {
        gap: 1rem;
      }
    }
  `]
})
export class HeaderComponent {}