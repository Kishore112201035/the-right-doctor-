import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-person-delete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="person-delete">
      <div class="card">
        <h2>Delete Person</h2>
        
        @if (loading) {
          <div class="spinner"></div>
        } @else if (error) {
          <div class="error-message">
            <p>{{ error }}</p>
            <button (click)="goBack()" class="btn btn-primary mt-4">Go Back</button>
          </div>
        } @else {
          <div class="confirmation">
            <p class="warning-text">Are you sure you want to delete this person?</p>
            
            <div class="person-details">
              <p><strong>Name:</strong> {{ person.name }}</p>
              <p><strong>Age:</strong> {{ person.age }}</p>
              <p><strong>Gender:</strong> {{ person.gender }}</p>
              <p><strong>Mobile:</strong> {{ person.mobile }}</p>
            </div>
            
            <p class="warning-message">This action cannot be undone.</p>
            
            <div class="d-flex gap-2 mt-4">
              <button 
                (click)="deletePerson()" 
                class="btn btn-danger"
                [disabled]="deleting"
              >
                Delete
              </button>
              <button 
                (click)="goBack()" 
                class="btn btn-secondary"
                [disabled]="deleting"
              >
                Cancel
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .person-delete {
      max-width: 600px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease;
    }
    
    .confirmation {
      padding: 1rem 0;
    }
    
    .warning-text {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    
    .person-details {
      background-color: var(--neutral-100);
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    
    .person-details p {
      margin: 0.5rem 0;
    }
    
    .warning-message {
      color: var(--error-500);
      font-weight: 500;
    }
    
    .error-message {
      text-align: center;
      padding: 2rem;
      color: var(--error-500);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class PersonDeleteComponent implements OnInit {
  person: Person = {
    name: '',
    age: 0,
    gender: 'Male',
    mobile: ''
  };
  
  personId = '';
  loading = true;
  deleting = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    this.loadPerson();
  }

  loadPerson(): void {
    if (!this.personId) {
      this.error = 'No person ID provided.';
      this.loading = false;
      return;
    }
    
    this.personService.getPerson(this.personId).subscribe({
      next: (data) => {
        this.person = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load person details. Please try again.';
        this.loading = false;
        this.toastService.showError(this.error);
      }
    });
  }

  deletePerson(): void {
    this.deleting = true;
    
    this.personService.deletePerson(this.personId).subscribe({
      next: () => {
        this.toastService.showSuccess('Person deleted successfully');
        this.router.navigate(['/person']);
      },
      error: (err) => {
        this.deleting = false;
        this.error = 'Failed to delete person. Please try again.';
        this.toastService.showError(this.error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/person']);
  }
}