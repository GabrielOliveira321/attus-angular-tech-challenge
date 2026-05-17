import { ChangeDetectionStrategy, Component, DestroyRef, Injectable, OnInit, inject, signal } from '@angular/core';

import { Observable, interval, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Pessoa {
    id: number;
    nome: string;
}

@Injectable({
    providedIn: 'root',
})
class PessoaService {
    /** @description Mock de uma busca em API com retorno em 0.5 segundos */
    buscarPorId(id: number): Observable<Pessoa> {
        return of({ id, nome: 'João', }).pipe(delay(500));
    }
}

@Component({
    selector: 'app-root',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h1>{{ texto() }}</h1>

        <p>
            Contador:
            {{ contador() }}
        </p>
    `,
})
export class AppComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    readonly texto = signal('');
    readonly contador = signal(0);

    constructor(private readonly pessoaService: PessoaService) { }

    ngOnInit(): void {
        this.buscarPessoa();
        this.iniciarContador();
    }

    private buscarPessoa(): void {
        this.pessoaService
            .buscarPorId(1)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((pessoa) => {
                this.texto.set(`Nome: ${pessoa.nome}`);
            });
    }

    private iniciarContador(): void {
        interval(1000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.contador.update((valorAtual) => valorAtual + 1);
            });
    }
}
// console.log('Atividade ChangeDetectionOnPush carregada! (Componente Angular não executado no terminal)');