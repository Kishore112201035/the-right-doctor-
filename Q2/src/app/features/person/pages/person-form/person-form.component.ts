import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="person-form">
      <div class="card">
        <h2>{{ isEditMode ? 'Edit Person' : 'Add New Person' }}</h2>
        
        @if (loading) {
          <div class="spinner"></div>
        } @else if (error) {
          <div class="error-message">
            <p>{{ error }}</p>
            <button (click)="goBack()" class="btn btn-primary mt-4">Go Back</button>
          </div>
        } @else {
          <form [formGroup]="personForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                placeholder="Enter name"
              >
              @if (formSubmitted && f['name'].errors) {
                <div class="form-error">
                  @if (f['name'].errors['required']) {
                    Name is required
                  }
                </div>
              }
            </div>
            
            <div class="form-group">
              <label for="age">Age</label>
              <input 
                type="number" 
                id="age" 
                formControlName="age" 
                placeholder="Enter age"
              >
              @if (formSubmitted && f['age'].errors) {
                <div class="form-error">
                  @if (f['age'].errors['required']) {
                    Age is required
                  } @else if (f['age'].errors['min']) {
                    Age must be at least 1
                  } @else if (f['age'].errors['max']) {
                    Age cannot be more than 120
                  }
                </div>
              }
            </div>
            
            <div class="form-group">
              <label for="gender">Gender</label>
              <select id="gender" formControlName="gender">
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              @if (formSubmitted && f['gender'].errors) {
                <div class="form-error">
                  @if (f['gender'].errors['required']) {
                    Gender is required
                  }
                </div>
              }
            </div>
            
            <div class="form-group">
              <label for="mobile">Mobile Number</label>
              <input 
                type="tel" 
                id="mobile" 
                formControlName="mobile" 
                placeholder="Enter mobile number"
              >
              @if (formSubmitted && f['mobile'].errors) {
                <div class="form-error">
                  @if (f['mobile'].errors['required']) {
                    Mobile number is required
                  } @else if (f['mobile'].errors['pattern']) {
                    Please enter a valid mobile number
                  }
                </div>
              }
            </div>
            
            <div class="d-flex gap-2 mt-4">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="submitting"
              >
                {{ isEditMode ? 'Update' : 'Save' }}
              </button>
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="goBack()"
                [disabled]="submitting"
              >
                Cancel
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .person-form {
      max-width: 600px;
      margin: 0 auto;
      animation: slideUp 0.3s ease;
    }
    
    .error-message {
      text-align: center;
      padding: 2rem;
      color: var(--error-500);
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class PersonFormComponent implements OnInit {
  personForm!: FormGroup;
  isEditMode = false;
  personId = '';
  loading = false;
  submitting = false;
  error = '';
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.personId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.personId;
    
    if (this.isEditMode) {
      this.loadPerson();
    }
  }
  
  get f() {
    return this.personForm.controls;
  }

  initForm(): void {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  loadPerson(): void {
    this.loading = true;
    
    this.personService.getPerson(this.personId).subscribe({
      next: (person) => {
        this.personForm.patchValue(person);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load person details. Please try again.';
        this.loading = false;
        this.toastService.showError(this.error);
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.personForm.invalid) {
      return;
    }
    
    this.submitting = true;
    const person: Person = this.personForm.value;
    
    if (this.isEditMode) {
      this.personService.updatePerson(this.personId, person).subscribe({
        next: () => {
          this.toastService.showSuccess('Person updated successfully');
          this.router.navigate(['/person']);
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.showError('Failed to update person. Please try again.');
        }
      });
    } else {
      this.personService.createPerson(person).subscribe({
        next: () => {
          this.toastService.showSuccess('Person added successfully');
          this.router.navigate(['/person']);
        },
        error: (err) => {
          this.submitting = false;
          this.toastService.showError('Failed to add person. Please try again.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/person']);
  }
}