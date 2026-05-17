interface ResultadoOperacao {
    success: boolean;
    message: string;
}

class Produto {
    constructor(
        public readonly id: number,
        public descricao: string,
        public quantidadeEstoque: number
    ) {}
}

class Verdureira {
    private readonly produtos: Produto[];

    constructor() {
        this.produtos = [
            new Produto(1, 'Maçã', 20),
            new Produto(2, 'Laranja', 0),
            new Produto(3, 'Limão', 20)
        ];
    }

    private produtoNaoEncontrado(produtoId: number): ResultadoOperacao {
        return {
            success: false,
            message: `Produto não encontrado com o id: ${produtoId}`
        };
    }

    getProdutoPorId(produtoId: number): Produto | undefined {
        return this.produtos.find(
            produto => produto.id === produtoId
        );
    }

    getDescricaoProduto(produtoId: number): string {
        const produto = this.getProdutoPorId(produtoId);

        if (!produto) {
            return `Produto não encontrado com o id: ${produtoId}`;
        }

        return `${produto.id} - ${produto.descricao} (${produto.quantidadeEstoque}x)`;
    }

    verificarEstoque(produtoId: number): ResultadoOperacao {
        const produto = this.getProdutoPorId(produtoId);

        if (!produto) {
            return this.produtoNaoEncontrado(produtoId);
        }

        return {
            success: produto.quantidadeEstoque > 0,
            message: `Quantidade em estoque de ${produto.descricao}: ${produto.quantidadeEstoque}`
        };
    }

    removerDoEstoque(
        produtoId: number,
        quantidade: number
    ): ResultadoOperacao {
        if (quantidade <= 0) {
            return {
                success: false,
                message: 'A quantidade deve ser maior que zero'
            };
        }

        const produto = this.getProdutoPorId(produtoId);

        if (!produto) {
            return this.produtoNaoEncontrado(produtoId);
        }

        if (produto.quantidadeEstoque < quantidade) {
            return {
                success: false,
                message: `Estoque insuficiente para remover ${quantidade} unidades`
            };
        }

        produto.quantidadeEstoque -= quantidade;

        return {
            success: true,
            message:
                `${quantidade} unidades de ${produto.descricao} removidas. ` +
                `Restam ${produto.quantidadeEstoque} no estoque`
        };
    }
}


console.log('Descrição do produto 1:', new Verdureira().getDescricaoProduto(1));
console.log('Verificar estoque do produto 2:', new Verdureira().verificarEstoque(2));
console.log('Remover 5 unidades do produto 3:', new Verdureira().removerDoEstoque(3, 5));