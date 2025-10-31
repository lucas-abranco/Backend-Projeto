import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('order_items') // Mapeia esta classe para a tabela 'order_items'
export class OrderItem {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  // Relação: Muitos Itens de Pedido (OrderItems) pertencem a Um Pedido (Order)
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'char', length: 36 })
  orderId: string;

  // Relação: Muitos Itens de Pedido (OrderItems) apontam para Um Produto (Product)
  // Nota: Não criamos uma relação @OneToMany em Product para não o sobrecarregar.
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', type: 'char', length: 36 })
  productId: string;

  @Column({ type: 'int' })
  quantity: number; // A quantidade deste item no pedido

  @Column({ name: 'price_per_unit', type: 'decimal', precision: 6, scale: 2 })
  pricePerUnit: number; // O preço do produto no momento da compra
}
