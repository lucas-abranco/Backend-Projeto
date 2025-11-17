// Caminho: projeto-back/src/stores/stores.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores') // Define o prefixo '/stores' para todas as rotas
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  /**
   * NOVO ENDPOINT
   * Rota: GET /stores/categories
   * É esta a rota que a sua HomePage (no Canvas) chama.
   */
  @Get('categories')
  findCategories() {
    return this.storesService.findUniqueCategories();
  }

  /**
   * Rota: GET /stores
   * Busca todos os estabelecimentos.
   */
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  /**
   * Rota: GET /stores/:id
   * Busca os detalhes de um estabelecimento.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOneById(id);
  }
  
  /**
   * Rota: GET /stores/:id/menu
   * Busca o menu de um estabelecimento.
   */
  @Get(':id/menu')
  findMenu(
    @Param('id') id: string,
    @Query('categoria') category?: string, // Aceita o filtro opcional
  ) {
    return this.storesService.findStoreMenu(id, category);
  }
}
