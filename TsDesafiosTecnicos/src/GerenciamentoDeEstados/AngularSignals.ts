import { ChangeDetectionStrategy, Component, computed, effect, output, signal } from '@angular/core';

export interface CartItem {
    readonly id: number;
    name: string;
    priceInCents: number;
    quantity: number;
}

@Component({
    selector: 'app-cart-counter',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="cart">
            <h2>Itens no Carrinho</h2>

            <ul>
                @for (item of items(); track item.id) {
                    <li>
                        <span>
                            {{ item.name }}
                            -
                            {{ item.quantity }}x
                            -
                            {{ formatPrice(item.priceInCents) }}
                        </span>

                        <div>
                            <button (click)="decreaseQuantity(item.id)">
                                -
                            </button>

                            <button (click)="increaseQuantity(item.id)">
                                +
                            </button>
                        </div>
                    </li>
                }
            </ul>

            <hr />

            <p>
                Total:
                <strong>
                    {{ formatPrice(totalInCents()) }}
                </strong>
            </p>
        </div>
    `,
})
export class CartCounterComponent {
    readonly items = signal<CartItem[]>([]);

    readonly totalInCents = computed(() => {
        return this.items().reduce((total, item) => {
            return total + (item.priceInCents * item.quantity);
        }, 0);
    });

    readonly totalChanged = output<number>();
    private initialized = false;

    constructor() {
        effect(() => {
            const total = this.totalInCents();

            if (!this.initialized) {
                this.initialized = true;
                return;
            }

            this.totalChanged.emit(total);
        });
    }

    addNewItem(newItem: CartItem): void {
        this.items.update((currentItems) => {
            return [
                ...currentItems,
                {
                    ...newItem,
                    quantity: 1,
                },
            ];
        });
    }

    increaseQuantity(itemId: number): void {
        this.items.update((currentItems) => {
            return currentItems.map((item) => {
                if (item.id !== itemId) {
                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            });
        });
    }

    decreaseQuantity(itemId: number): void {
        this.items.update((currentItems) => {
            return currentItems
                .map((item) => {
                    if (item.id !== itemId) {
                        return item;
                    }
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                    };
                })
                .filter((item) => item.quantity > 0);
        });
    }

    formatPrice(valueInCents: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valueInCents / 100);
    }
}

// console.log('Atividade AngularSignals carregada! (Componente CartCounterComponent configurado com Signals)');