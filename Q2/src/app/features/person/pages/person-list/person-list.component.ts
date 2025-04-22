import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="person-list">
      <div class="card">
        <div class="d-flex justify-between items-center mb-4">
          <h2>People List</h2>
          <a routerLink="/person/new" class="btn btn-primary">Add New Person</a>
        </div>
        
        @if (loading) {
          <div class="spinner"></div>
        } @else if (error) {
          <div class="error-message">
            <p>{{ error }}</p>
            <button (click)="loadPersons()" class="btn btn-primary mt-4">Try Again</button>
          </div>
        } @else if (persons.length === 0) {
          <div class="empty-state">
            <h3>No people found</h3>
            <p>Get started by adding a new person.</p>
            <a routerLink="/person/new" class="btn btn-primary mt-4">Add Person</a>
          </div>
        } @else {
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (person of persons; track person._id) {
                  <tr>
                    <td>{{ person.name }}</td>
                    <td>{{ person.age }}</td>
                    <td>{{ person.gender }}</td>
                    <td>{{ person.mobile }}</td>
                    <td>
                      <div class="d-flex gap-2">
                        <a 
                          [routerLink]="['/person/edit', person._id]" 
                          class="btn btn-secondary"
                        >
                          Edit
                        </a>
                        <a 
                          [routerLink]="['/person/delete', person._id]" 
                          class="btn btn-danger"
                        >
                          Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .person-list {
      animation: fadeIn 0.3s ease;
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem 0;
      color: var(--neutral-500);
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
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  loading = true;
  error = '';

  constructor(
    private personService: PersonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading = true;
    this.error = '';
    
    this.personService.getPersons().subscribe({
      next: (data) => {
        this.persons = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load people. Please try again.';
        this.loading = false;
        this.toastService.showError(this.error);
      }
    });
  }
}