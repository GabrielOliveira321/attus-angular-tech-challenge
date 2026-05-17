import '@angular/compiler';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  createAction,
  props,
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const loadTodosError = createAction(
  '[Todo] Load Todos Error',
  props<{ error: string }>()
);

export const toggleTodoComplete = createAction(
  '[Todo] Toggle Todo Complete',
  props<{ id: string }>()
);

export const todoReducer = createReducer(
  initialState,

  on(loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
    error: null,
  })),

  on(loadTodosError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(toggleTodoComplete, (state, { id }) => ({
    ...state,

    todos: state.todos.map((todo) =>
      todo.id === id
        ? {
          ...todo,
          completed: !todo.completed,
        }
        : todo
    ),
  }))
);

export const selectTodoState =
  createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectPendingTodos = createSelector(
  selectAllTodos,
  (todos: Todo[]) =>
    todos.filter((todo) => !todo.completed)
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos: Todo[]) =>
    todos.filter((todo) => todo.completed)
);

export const selectLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.loading
);

export const selectError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),

      switchMap(() =>
        this.http
          .get<Todo[]>('https://api.exemplo.com/todos')
          .pipe(
            map((todos: Todo[]) =>
              loadTodosSuccess({ todos })
            ),

            catchError((error: Error) =>
              of(
                loadTodosError({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );
}

// console.log('Atividade NgrxTodo carregada! (Configuração de estado NgRx concluída)');