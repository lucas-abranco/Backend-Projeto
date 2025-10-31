import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('cart_items')
export class CartItem {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product; // Para carregar detalhes do produto

  @Column({ name: 'product_id', type: 'char', length: 36 })
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
