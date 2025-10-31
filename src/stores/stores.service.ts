import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { ProductsService } from 'src/products/products.service'; // Importa o serviço de produtos

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    // Injeta o ProductsService para podermos usá-lo
    private productsService: ProductsService,
  ) {}

  // Busca todos os estabelecimentos
  async findAll(): Promise<Store[]> {
    return this.storesRepository.find();
  }

  // Busca um estabelecimento pelo ID
  async findOneById(id: string): Promise<Store> {
    const store = await this.storesRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Estabelecimento com ID "${id}" não encontrado.`);
    }
    return store;
  }

  // Busca os detalhes da loja e o seu menu (com opção de filtro por categoria)
  async findStoreMenu(id: string, categoryFilter?: string): Promise<any> {
    // Busca os detalhes da loja usando o método que já tínhamos
    const store = await this.findOneById(id);

    // Usa o ProductsService injetado para buscar os produtos da loja,
    // passando o ID da loja e o filtro de categoria (se existir)
    const products = await this.productsService.findByStoreId(id, categoryFilter);

    // Organiza os produtos encontrados num formato de menu por categoria
    const menu = products.reduce((acc, product) => {
      const category = product.category || 'Outros'; // Agrupa produtos sem categoria em "Outros"
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    // Retorna um objeto combinado com os dados da loja e o menu organizado
    return {
      ...store, // Inclui todas as propriedades da loja (nome, taxa de entrega, etc.)
      menu: Object.keys(menu).map(categoryName => ({
        name: categoryName,
        items: menu[categoryName],
      })),
    };
  }
}
