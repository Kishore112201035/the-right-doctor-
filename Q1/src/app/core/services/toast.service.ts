import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ message, type: 'success' });
  }

  showError(message: string): void {
    this.toastSubject.next({ message, type: 'error' });
  }

  showWarning(message: string): void {
    this.toastSubject.next({ message, type: 'warning' });
  }

  clear(): void {
    this.toastSubject.next(null);
  }
}