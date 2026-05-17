import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserStore, User } from '@user-management-workspace/data-access-users';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, take } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'lib-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Usuários</h1>
        <button mat-fab color="warn" (click)="openForm()">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <mat-form-field appearance="outline" class="search-bar">
        <mat-label>Pesquisar por nome</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Digite o nome...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div *ngIf="store.error()" class="error-message">
        {{ store.error() }}
        <button mat-button color="primary" (click)="loadUsers()">Tentar Novamente</button>
      </div>

      <div *ngIf="store.loading()" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="user-grid" *ngIf="!store.loading() && !store.error()">
        <mat-card *ngFor="let user of filteredUsers()" class="user-card">
          <mat-card-header>
            <div mat-card-avatar class="avatar">
              <mat-icon>person</mat-icon>
            </div>
            <mat-card-title>{{ user.name }}</mat-card-title>
            <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions align="end">
            <button mat-button color="primary" (click)="openForm(user)">EDITAR</button>
          </mat-card-actions>
        </mat-card>

        <div *ngIf="filteredUsers().length === 0" class="no-results">
          Nenhum usuário encontrado.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .search-bar {
      width: 100%;
      margin-bottom: 24px;
    }
    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .user-card {
      height: 100%;
    }
    .avatar {
      background-color: #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loading-spinner, .error-message, .no-results {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 48px;
      flex-direction: column;
      gap: 16px;
    }
    .error-message {
      color: red;
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  store = inject(UserStore);
  private dialog = inject(MatDialog);

  searchControl = new FormControl('');
  searchTerm = signal('');
  
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const users = this.store.users();
    if (!term) return users;
    return users.filter(u => u.name.toLowerCase().includes(term));
  });

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadUsers();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        this.searchTerm.set(term || '');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.store.loadUsers().pipe(takeUntil(this.destroy$)).subscribe();
  }

  openForm(user?: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      data: { user },
      width: '400px'
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.store.saveUser(result).pipe(take(1)).subscribe();
      }
    });
  }
}
