import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toasts.length">
      @for (toast of toasts; track toast.id) {
        <div 
          class="toast"
          [ngClass]="{'toast-success': toast.type === 'success', 'toast-error': toast.type === 'error'}"
        >
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: []
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}