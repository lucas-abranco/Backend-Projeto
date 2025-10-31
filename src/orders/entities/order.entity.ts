import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Store } from 'src/stores/entities/store.entity';
import { OrderItem } from './order-item.entity'; // Este será o próximo ficheiro que iremos criar

@Entity('orders') // Mapeia esta classe para a tabela 'orders'
export class Order {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  // Relação: Muitos Pedidos (Orders) pertencem a Um Utilizador (User)
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  // Relação: Muitos Pedidos (Orders) pertencem a Um Estabelecimento (Store)
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id', type: 'char', length: 36 })
  storeId: string;

  // ID do Entregador. A relação completa será adicionada quando criarmos o módulo 'drivers'.
  @Column({ name: 'driver_id', type: 'char', length: 36, nullable: true })
  driverId: string;

  // Relação: Um Pedido (Order) tem Muitos Itens de Pedido (OrderItems)
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Column({ type: 'varchar', length: 50, default: 'Em andamento' })
  status: string;

  @Column({ name: 'total_price', type: 'decimal', precision: 6, scale: 2 })
  totalPrice: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 5, scale: 2 })
  deliveryFee: number;

  @Column({ name: 'delivery_address', type: 'text' })
  deliveryAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;
}
