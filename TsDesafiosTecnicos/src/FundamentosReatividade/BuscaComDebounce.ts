import '@angular/compiler';

import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';

import {
    Observable,
    of,
} from 'rxjs';

import {
    catchError,
    debounceTime,
    delay,
    distinctUntilChanged,
    finalize,
    startWith,
    switchMap,
    tap,
} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class BuscaService {
    buscarItens(termo: string): Observable<string[]> {
        if (!termo.trim()) {
            return of([]);
        }

        return of([
            `Resultado 1 para "${termo}"`,
            `Resultado 2 para "${termo}"`,
            `Resultado 3 para "${termo}"`,
        ]).pipe(delay(1000));
    }
}

@Component({
    selector: 'app-busca-debounce',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],

    template: `
    <div class="busca-container">
      <h2>Busca Reativa com RxJS</h2>

      <input
        type="text"
        [formControl]="buscaControl"
        placeholder="Digite para buscar..."
      />

      <div *ngIf="loading" style="color: blue;">
        Carregando resultados... ⏳
      </div>

      <ul *ngIf="(resultados$ | async) as resultados">

        <li
          *ngIf="
            resultados.length === 0 &&
            !loading &&
            buscaControl.value
          "
        >
          Nenhum resultado encontrado.
        </li>

        <li *ngFor="let item of resultados">
          {{ item }}
        </li>

      </ul>
    </div>
  `,
})
export class BuscaComponent {
    buscaControl = new FormControl('');

    resultados$: Observable<string[]>;

    loading = false;

    constructor(private buscaService: BuscaService) {

        this.resultados$ = this.buscaControl.valueChanges.pipe(

            startWith(''),

            debounceTime(500),

            distinctUntilChanged(),

            tap(() => {
                this.loading = true;
            }),

            switchMap((termo) =>
                this.buscaService.buscarItens(termo || '').pipe(

                    catchError(() => {
                        return of([]);
                    }),

                    finalize(() => {
                        this.loading = false;
                    })
                )
            )
        );
    }
}

// console.log('Atividade BuscaComDebounce carregada! (Lógica reativa RxJS pronta para uso)');