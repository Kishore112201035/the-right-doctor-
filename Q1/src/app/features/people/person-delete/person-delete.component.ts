import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../../core/models/person.model';
import { PeopleService } from '../../../core/services/people.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-person-delete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="person-delete-container slide-up">
      <h2>Delete Person</h2>
      
      <div class="card">
        <div *ngIf="loading" class="loader"></div>
        
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
        
        <div *ngIf="!loading && !error && person">
          <div class="confirmation-message">
            <p>Are you sure you want to delete the following person?</p>
            <p><strong>This action cannot be undone.</strong></p>
          </div>
          
          <div class="person-details">
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">{{ person.name }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">{{ person.email }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">{{ person.phone }}</span>
            </div>
            
            <div *ngIf="person.company?.name" class="detail-row">
              <span class="label">Company:</span>
              <span class="value">{{ person.company?.name }}</span>
            </div>
          </div>
          
          <div class="delete-actions">
            <button type="button" class="btn-outline" (click)="cancel()">Cancel</button>
            <button type="button" class="btn-danger" (click)="confirmDelete()" [disabled]="deleting">
              {{ deleting ? 'Deleting...' : 'Delete Person' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .person-delete-container {
      margin-top: calc(var(--spacing-unit) * 2);
    }
    
    .confirmation-message {
      margin-bottom: calc(var(--spacing-unit) * 3);
      padding: calc(var(--spacing-unit) * 2);
      background-color: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--warning-color);
      border-radius: 4px;
    }
    
    .confirmation-message p:not(:last-child) {
      margin-bottom: calc(var(--spacing-unit));
    }
    
    .person-details {
      margin-bottom: calc(var(--spacing-unit) * 3);
      padding: calc(var(--spacing-unit) * 2);
      background-color: var(--background-color);
      border-radius: 4px;
    }
    
    .detail-row {
      display: flex;
      margin-bottom: calc(var(--spacing-unit));
    }
    
    .label {
      font-weight: 600;
      width: 100px;
      flex-shrink: 0;
    }
    
    .delete-actions {
      display: flex;
      justify-content: flex-end;
      gap: calc(var(--spacing-unit) * 2);
    }
    
    .error-message {
      padding: calc(var(--spacing-unit) * 2);
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
      border-radius: 4px;
      text-align: center;
      margin-bottom: calc(var(--spacing-unit) * 2);
    }
    
    @media (max-width: 768px) {
      .detail-row {
        flex-direction: column;
      }
      
      .label {
        width: auto;
        margin-bottom: calc(var(--spacing-unit) / 2);
      }
    }
  `]
})
export class PersonDeleteComponent implements OnInit {
  person: Person | null = null;
  loading = true;
  deleting = false;
  error: string | null = null;
  personId: number | null = null;

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.personId = +idParam;
      this.loadPerson(this.personId);
    } else {
      this.error = 'Person ID not provided';
      this.loading = false;
    }
  }

  loadPerson(id: number): void {
    this.peopleService.getPerson(id).subscribe({
      next: (person) => {
        this.person = person;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load person details. Please try again.';
        this.loading = false;
        this.toastService.showError(this.error);
      }
    });
  }

  confirmDelete(): void {
    if (!this.personId) {
      return;
    }
    
    this.deleting = true;
    
    this.peopleService.deletePerson(this.personId).subscribe({
      next: () => {
        this.deleting = false;
        this.toastService.showSuccess('Person deleted successfully');
        this.router.navigate(['/people']);
      },
      error: (err) => {
        this.error = 'Failed to delete person. Please try again.';
        this.deleting = false;
        this.toastService.showError(this.error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/people']);
  }
}