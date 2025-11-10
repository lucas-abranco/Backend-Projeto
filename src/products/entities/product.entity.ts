// Caminho: projeto-back/src/products/entities/product.entity.ts
import { Store } from 'src/stores/entities/store.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('products') // Mapeia esta classe para a tabela 'products'
export class Product {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string; // ID único do produto

  // Relação: Muitos produtos pertencem a Uma loja
  // CORREÇÃO AQUI: A função deve apontar para a propriedade 'products' na entidade Store
  @ManyToOne(() => Store, (store) => store.products) 
  @JoinColumn({ name: 'store_id' }) // Especifica que a coluna 'store_id' é a chave estrangeira
  store: Store; // Propriedade para aceder ao objeto Store completo

  // Coluna para guardar o ID da loja (para queries mais simples)
  @Column({ name: 'store_id', type: 'char', length: 36 })
  storeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;
}
