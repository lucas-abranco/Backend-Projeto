import { Store } from 'src/stores/entities/store.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('products') // Mapeia esta classe para a tabela 'products'
export class Product {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string; // ID único do produto

  // Define a relação Muitos-para-Um: Muitos produtos pertencem a Uma loja
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'store_id' }) // Especifica que a coluna 'store_id' é a chave estrangeira
  store: Store; // Propriedade para aceder ao objeto Store completo (se carregado)

  // Coluna para guardar o ID da loja diretamente (útil para queries mais simples)
  @Column({ name: 'store_id', type: 'char', length: 36 })
  storeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Nome do produto

  @Column({ type: 'text', nullable: true })
  description: string; // Descrição do produto (opcional)

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number; // Preço do produto

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string; // Categoria do produto dentro da loja (ex: "Pizzas", "Bebidas")

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string; // URL da imagem do produto (opcional)
}
