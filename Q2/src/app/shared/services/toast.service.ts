import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toasts$ = this.toastSubject.asObservable();
  
  private counter = 0;

  showSuccess(message: string): void {
    this.toastSubject.next({
      message,
      type: 'success',
      id: this.getNextId()
    });
  }

  showError(message: string): void {
    this.toastSubject.next({
      message,
      type: 'error',
      id: this.getNextId()
    });
  }

  private getNextId(): number {
    return this.counter++;
  }
}