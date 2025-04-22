import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from '../../../core/models/person.model';
import { PeopleService } from '../../../core/services/people.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="person-edit-container slide-up">
      <h2>{{ isEditMode ? 'Edit Person' : 'Add New Person' }}</h2>
      
      <div class="card">
        <div *ngIf="loading" class="loader"></div>
        
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
        
        <form *ngIf="!loading && !error" [formGroup]="personForm" (ngSubmit)="savePerson()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['name'].errors}"
            >
            <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
              <div *ngIf="f['name'].errors['required']">Name is required</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['email'].errors}"
            >
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Please enter a valid email address</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              formControlName="phone" 
              class="form-control"
              [ngClass]="{'is-invalid': submitted && f['phone'].errors}"
            >
            <div *ngIf="submitted && f['phone'].errors" class="invalid-feedback">
              <div *ngIf="f['phone'].errors['required']">Phone number is required</div>
            </div>
          </div>
          
          <div formGroupName="address">
            <h3>Address</h3>
            
            <div class="form-group">
              <label for="street">Street</label>
              <input 
                type="text" 
                id="street" 
                formControlName="street" 
                class="form-control"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  formControlName="city" 
                  class="form-control"
                >
              </div>
              
              <div class="form-group">
                <label for="zipcode">Zip Code</label>
                <input 
                  type="text" 
                  id="zipcode" 
                  formControlName="zipcode" 
                  class="form-control"
                >
              </div>
            </div>
          </div>
          
          <div formGroupName="company">
            <h3>Company Information</h3>
            
            <div class="form-group">
              <label for="companyName">Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                formControlName="name" 
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label for="position">Position</label>
              <input 
                type="text" 
                id="position" 
                formControlName="position" 
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-outline" (click)="cancel()">Cancel</button>
            <button type="submit" class="btn-primary">{{ isEditMode ? 'Update' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .person-edit-container {
      margin-top: calc(var(--spacing-unit) * 2);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: calc(var(--spacing-unit) * 2);
      margin-top: calc(var(--spacing-unit) * 3);
    }
    
    h3 {
      margin-top: calc(var(--spacing-unit) * 3);
      margin-bottom: calc(var(--spacing-unit) * 2);
      font-size: 1.2rem;
      color: var(--text-light);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: calc(var(--spacing-unit));
    }
    
    .form-row {
      display: flex;
      gap: calc(var(--spacing-unit) * 2);
    }
    
    .form-row .form-group {
      flex: 1;
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
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class PersonEditComponent implements OnInit {
  personForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitted = false;
  error: string | null = null;
  personId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.personForm = this.createPersonForm();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.isEditMode = true;
      this.personId = +idParam;
      this.loadPerson(this.personId);
    }
  }

  createPersonForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        zipcode: ['']
      }),
      company: this.formBuilder.group({
        name: [''],
        position: ['']
      })
    });
  }

  loadPerson(id: number): void {
    this.loading = true;
    
    this.peopleService.getPerson(id).subscribe({
      next: (person) => {
        this.patchFormValues(person);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load person details. Please try again.';
        this.loading = false;
        this.toastService.showError(this.error);
      }
    });
  }

  patchFormValues(person: Person): void {
    this.personForm.patchValue({
      name: person.name,
      email: person.email,
      phone: person.phone,
      address: {
        street: person.address?.street || '',
        city: person.address?.city || '',
        zipcode: person.address?.zipcode || ''
      },
      company: {
        name: person.company?.name || '',
        position: person.company?.position || ''
      }
    });
  }

  savePerson(): void {
    this.submitted = true;
    
    if (this.personForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const person = this.personForm.value;
    
    if (this.isEditMode && this.personId) {
      person.id = this.personId;
      
      this.peopleService.updatePerson(this.personId, person).subscribe({
        next: () => {
          this.loading = false;
          this.toastService.showSuccess('Person updated successfully');
          this.router.navigate(['/people']);
        },
        error: (err) => {
          this.error = 'Failed to update person. Please try again.';
          this.loading = false;
          this.toastService.showError(this.error);
        }
      });
    } else {
      this.peopleService.createPerson(person).subscribe({
        next: () => {
          this.loading = false;
          this.toastService.showSuccess('Person added successfully');
          this.router.navigate(['/people']);
        },
        error: (err) => {
          this.error = 'Failed to add person. Please try again.';
          this.loading = false;
          this.toastService.showError(this.error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/people']);
  }

  get f() { 
    return this.personForm.controls; 
  }
}