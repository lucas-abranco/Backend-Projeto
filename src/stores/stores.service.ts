import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private productsService: ProductsService,
  ) {}

  /**
   * Busca todos os estabelecimentos.
   */
  async findAll(): Promise<Store[]> {
    return this.storesRepository.find();
  }

  /**
   * Busca um estabelecimento específico pelo seu ID.
   */
  async findOneById(id: string): Promise<Store> {
    const store = await this.storesRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Estabelecimento com ID "${id}" não encontrado.`);
    }
    return store;
  }

  /**
   * Busca os detalhes da loja e o seu menu (com opção de filtro por categoria).
   */
  async findStoreMenu(id: string, categoryFilter?: string): Promise<any> {
    const store = await this.findOneById(id);
    const products = await this.productsService.findByStoreId(id, categoryFilter);

    // Organiza os produtos encontrados num formato de menu por categoria
    const menu = products.reduce((acc, product) => {
      const category = product.category || 'Outros';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    return {
      ...store,
      menu: Object.keys(menu).map(categoryName => ({
        name: categoryName,
        items: menu[categoryName],
      })),
    };
  }

  /**
   * Busca as categorias de lojas únicas para a HomePage.
   */
  async findUniqueCategories(): Promise<any[]> {
    const categories = await this.storesRepository
      .createQueryBuilder('store')
      .select('DISTINCT store.category', 'category')
      .addSelect('store.name', 'name')
      .addSelect('store.id', 'id')
      .getRawMany();

    // Mapeia os dados do back-end para o formato que o front-end espera
    return categories.map(cat => {
      let path = `/restaurantes/${cat.category}`;
      let description = 'Veja as opções disponíveis';

      if (cat.category === 'farmacia') {
        path = '/farmacia/farmacia-saude-bem-estar';
        description = 'Medicamentos e Higiene';
      } else if (cat.category === 'petshop') {
        path = '/petshop/pet-shop-amigo-fiel';
        description = 'Ração e higiene pet';
      }

      return {
        id: cat.id,
        title: cat.name,
        description: description,
        path: path,
      };
    });
  }
}