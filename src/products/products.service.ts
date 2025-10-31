import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // Busca produtos de uma loja, opcionalmente filtrando por categoria
  async findByStoreId(storeId: string, category?: string): Promise<Product[]> {
    // Cria o objeto base para a cláusula 'where'
    const whereClause: FindOptionsWhere<Product> = { storeId };

    // Se um filtro de categoria foi fornecido, adiciona-o
    if (category) {
      whereClause.category = category;
    }

    // Define as opções completas da consulta, incluindo o 'where' e a ordenação
    const options: FindManyOptions<Product> = {
      where: whereClause,
      order: { category: 'ASC', name: 'ASC' }, // Ordena por categoria e depois por nome
    };

    // Executa a consulta 'find' com as opções
    return this.productsRepository.find(options);
  }
}
