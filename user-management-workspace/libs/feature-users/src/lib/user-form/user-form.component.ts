import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from '@user-management-workspace/data-access-users';

@Component({
  selector: 'lib-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <mat-form-field appearance="fill">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" placeholder="Ex. João da Silva">
          <mat-error *ngIf="userForm.get('name')?.hasError('required')">Nome é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>E-mail</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Ex. joao@email.com">
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">E-mail é obrigatório</mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">E-mail inválido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf" placeholder="000.000.000-00">
          <mat-error *ngIf="userForm.get('cpf')?.hasError('required')">CPF é obrigatório</mat-error>
          <mat-error *ngIf="userForm.get('cpf')?.hasError('pattern')">Formato inválido (000.000.000-00)</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="phone" placeholder="(00) 00000-0000">
          <mat-error *ngIf="userForm.get('phone')?.hasError('required')">Telefone é obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Tipo de Telefone</mat-label>
          <mat-select formControlName="phoneType">
            <mat-option value="celular">Celular</mat-option>
            <mat-option value="residencial">Residencial</mat-option>
            <mat-option value="comercial">Comercial</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="save()">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      margin-top: 8px;
    }
  `]
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormComponent>);

  userForm: FormGroup;
  isEdit: boolean;
  userId?: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user?: User }) {
    this.isEdit = !!data?.user;
    this.userId = data?.user?.id;

    this.userForm = this.fb.group({
      name: [data?.user?.name || '', Validators.required],
      email: [data?.user?.email || '', [Validators.required, Validators.email]],
      cpf: [data?.user?.cpf || '', [Validators.required, Validators.pattern(/^\\d{3}\\.\\d{3}\\.\\d{3}\\-\\d{2}$/)]],
      phone: [data?.user?.phone || '', Validators.required],
      phoneType: [data?.user?.phoneType || 'celular', Validators.required],
    });
  }

  save() {
    if (this.userForm.valid) {
      this.dialogRef.close({
        id: this.userId,
        ...this.userForm.value
      });
    }
  }
}
