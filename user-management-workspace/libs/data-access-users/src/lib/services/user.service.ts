import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    { id: '1', name: 'João Silva', email: 'joao@example.com', cpf: '111.111.111-11', phone: '11999999999', phoneType: 'celular' },
    { id: '2', name: 'Maria Souza', email: 'maria@example.com', cpf: '222.222.222-22', phone: '11888888888', phoneType: 'celular' }
  ];

  getUsers(): Observable<User[]> {
    // Simulating HTTP request with delay
    return timer(800).pipe(
      switchMap(() => {
        // Randomly simulate an error (10% chance)
        if (Math.random() < 0.1) {
          return throwError(() => new Error('Erro ao carregar usuários.'));
        }
        return of([...this.mockUsers]);
      }),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  saveUser(user: User): Observable<User> {
    return timer(500).pipe(
      map(() => {
        if (user.id) {
          const index = this.mockUsers.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.mockUsers[index] = { ...user };
          }
        } else {
          user.id = Math.random().toString(36).substring(2, 9);
          this.mockUsers.push(user);
        }
        return user;
      })
    );
  }
}
