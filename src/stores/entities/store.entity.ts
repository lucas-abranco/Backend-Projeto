import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity'; // Importa a entidade Product

@Entity('stores') // Mapeia esta classe para a tabela 'stores'
export class Store {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string; // Ex: 'refeicao', 'farmacia'

  @Column({ type: 'varchar', length: 100, nullable: true })
  cuisine: string; // Ex: 'Pizza', 'Hambúrguer'

  @Column({ name: 'delivery_time', type: 'varchar', length: 50, nullable: true })
  deliveryTime: string;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 5, scale: 2 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  // Define a relação One-to-Many com a entidade Product
  // Uma loja (Store) pode ter muitos produtos (Product)
  @OneToMany(() => Product, (product) => product.store)
  products: Product[]; // Propriedade para aceder à lista de produtos relacionados
}
