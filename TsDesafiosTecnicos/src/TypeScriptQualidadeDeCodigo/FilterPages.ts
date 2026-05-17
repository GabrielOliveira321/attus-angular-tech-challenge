interface PaginaParams {
    pagina: number;
    tamanho: number;
}

interface Pagina<T> {
    itens: T[];
    total: number;
    pagina: number;
    tamanho: number;
    totalPaginas: number;
}

function filtrarEPaginar<T>(
    data: T[],
    filterFn: (item: T) => boolean,
    params: PaginaParams
): Pagina<T> {
    const { pagina, tamanho } = params;

    const itensFiltrados = data.filter(filterFn);

    const inicio = (pagina - 1) * tamanho;
    const fim = inicio + tamanho;

    const itensPaginados = itensFiltrados.slice(inicio, fim);

    return {
        itens: itensPaginados,
        total: itensFiltrados.length,
        pagina,
        tamanho,
        totalPaginas: Math.ceil(itensFiltrados.length / tamanho)
    };
}

interface Usuario {
    id: number;
    nome: string;
    ativo: boolean;
}

const usuarios: Usuario[] = [
    { id: 1, nome: 'Gabriel', ativo: true },
    { id: 2, nome: 'Maria', ativo: false },
    { id: 3, nome: 'João', ativo: true },
    { id: 4, nome: 'Ana', ativo: true }
];

const resultado = filtrarEPaginar<Usuario>(
    usuarios,
    usuario => usuario.ativo,
    {
        pagina: 1,
        tamanho: 2
    }
);

console.log(resultado);