import { OnInit } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';

class PessoaServiceMock {
    buscarPorId(id: number): Observable<Person> {
        return of({ id, nome: 'Gabriel' });
    }

    buscarQuantidadeFamiliares(pessoaId: number): Observable<number> {
        return of(3);
    }
}

interface Person {
    id: number;
    nome: string;
}

export class AppComponent implements OnInit {
    texto = '';

    pessoaService = new PessoaServiceMock();

    ngOnInit(): void {
        const pessoaId = 1;

        forkJoin({
            pessoa: this.pessoaService.buscarPorId(pessoaId),
            quantidadeFamiliares:
                this.pessoaService.buscarQuantidadeFamiliares(pessoaId),
        }).subscribe(({ pessoa, quantidadeFamiliares }) => {
            this.texto = `Nome: ${pessoa.nome} | familiares: ${quantidadeFamiliares}`;

            console.log(`this.texto: ${this.texto}`);
        });
    }
}

const app = new AppComponent();
app.ngOnInit();

/*
Escolhas:

1. forkJoin: Foi escolhido para eliminar os "subscribes aninhados" e executar as duas chamadas
   de forma paralela. Como ambas dependem apenas do "pessoaId" e uma não depende do resultado
   da outra, o forkJoin se encaixa melhor nesse cenário. Ele retorna os resultados somente
   quando ambos os Observables finalizam.

2. quantidadeFamiliares: O nome da variável foi alterado para deixar o código mais legível
   e evitar abreviações como "qtd", facilitando a manutenção e entendimento do código.

3. Remoção do switchMap e map: Esses operadores não eram necessários nesse caso,
   pois não existe dependência entre as chamadas. O uso do forkJoin deixou o fluxo
   mais simples e mais fácil de entender.

4. Remoção do takeUntil: Nesse exemplo os Observables utilizados com "of()" e "forkJoin"
   completam automaticamente após emitir os valores, então não há risco real de memory leak.
   Por isso o takeUntil foi removido para evitar complexidade desnecessária.
*/