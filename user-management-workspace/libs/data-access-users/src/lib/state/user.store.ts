import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private userService = inject(UserService);

  // State using Signals
  private state = signal<UserState>({
    users: [],
    loading: false,
    error: null
  });

  // Selectors
  readonly users = computed(() => this.state().users);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  // Actions
  loadUsers() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.userService.getUsers().pipe(
      tap(users => this.state.update(s => ({ ...s, users, loading: false }))),
      catchError(error => {
        this.state.update(s => ({ ...s, error: error.message, loading: false }));
        return EMPTY;
      })
    );
  }

  saveUser(user: User) {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    return this.userService.saveUser(user).pipe(
      tap(savedUser => {
        this.state.update(s => {
          const exists = s.users.some(u => u.id === savedUser.id);
          const users = exists 
            ? s.users.map(u => u.id === savedUser.id ? savedUser : u)
            : [...s.users, savedUser];
          return { ...s, users, loading: false };
        });
      }),
      catchError(error => {
        this.state.update(s => ({ ...s, error: error.message, loading: false }));
        return EMPTY;
      })
    );
  }
}
