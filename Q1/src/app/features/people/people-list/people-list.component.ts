import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Person } from '../../../core/models/person.model';
import { PeopleService } from '../../../core/services/people.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="people-list-container slide-up">
      <div class="list-header">
        <h2>People List</h2>
        <a routerLink="/people/new" class="btn-primary">Add New Person</a>
      </div>
      
      <div class="search-filter">
        <div class="form-group">
          <input 
            type="text" 
            [formControl]="searchControl"
            class="form-control" 
            placeholder="Search by name or email..."
          >
        </div>
      </div>
      
      <div class="card">
        <div *ngIf="loading" class="loader"></div>
        
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
        
        <div *ngIf="!loading && !error">
          <div *ngIf="filteredPeople.length === 0" class="empty-state">
            <p>No people found. Try a different search or add a new person.</p>
          </div>
          
          <table *ngIf="filteredPeople.length > 0" class="table">
            <thead>
              <tr>
                <th (click)="sortBy('name')">
                  Name 
                  <span *ngIf="sortField === 'name'" class="sort-icon">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th (click)="sortBy('email')">
                  Email
                  <span *ngIf="sortField === 'email'" class="sort-icon">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th (click)="sortBy('phone')">
                  Phone
                  <span *ngIf="sortField === 'phone'" class="sort-icon">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let person of filteredPeople">
                <td>{{ person.name }}</td>
                <td>{{ person.email }}</td>
                <td>{{ person.phone }}</td>
                <td>{{ person.company?.name || 'N/A' }}</td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/people', person.id, 'edit']" class="btn-outline">Edit</a>
                    <a [routerLink]="['/people', person.id, 'delete']" class="btn-danger">Delete</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .people-list-container {
      margin-top: calc(var(--spacing-unit) * 2);
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: calc(var(--spacing-unit) * 3);
    }
    
    .search-filter {
      margin-bottom: calc(var(--spacing-unit) * 3);
    }
    
    .empty-state {
      text-align: center;
      padding: calc(var(--spacing-unit) * 4);
      color: var(--text-light);
    }
    
    .error-message {
      padding: calc(var(--spacing-unit) * 2);
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
      border-radius: 4px;
      text-align: center;
    }
    
    .sort-icon {
      margin-left: calc(var(--spacing-unit) / 2);
    }
    
    th {
      cursor: pointer;
      user-select: none;
    }
    
    th:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  `]
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  filteredPeople: Person[] = [];
  loading = true;
  error: string | null = null;
  searchControl = new FormControl('');
  sortField: keyof Person = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private peopleService: PeopleService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPeople();
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterPeople(value || '');
    });
  }

  loadPeople(): void {
    this.loading = true;
    this.error = null;
    
    this.peopleService.getPeople().subscribe({
      next: (people) => {
        this.people = people;
        this.filteredPeople = [...people];
        this.sortPeople();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load people. Please try again later.';
        this.loading = false;
        this.toastService.showError(this.error);
      }
    });
  }

  filterPeople(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredPeople = [...this.people];
    } else {
      const term = searchTerm.toLowerCase().trim();
      this.filteredPeople = this.people.filter(person => 
        person.name.toLowerCase().includes(term) || 
        person.email.toLowerCase().includes(term)
      );
    }
    
    this.sortPeople();
  }

  sortBy(field: keyof Person): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.sortPeople();
  }

  sortPeople(): void {
    this.filteredPeople = [...this.filteredPeople].sort((a, b) => {
      const valueA = String(a[this.sortField] || '').toLowerCase();
      const valueB = String(b[this.sortField] || '').toLowerCase();
      
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}