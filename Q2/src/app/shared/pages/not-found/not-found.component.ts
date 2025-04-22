import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a routerLink="/" class="btn btn-primary">Go Home</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 4rem 0;
    }
    
    h1 {
      font-size: 6rem;
      color: var(--primary-500);
      margin-bottom: 0;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 2rem;
      color: var(--neutral-600);
    }
  `]
})
export class NotFoundComponent {}