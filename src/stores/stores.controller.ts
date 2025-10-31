import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores') // Define o prefixo '/stores' para todas as rotas
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // Rota para GET /stores
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  // Rota para GET /stores/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOneById(id);
  }

  // Rota para GET /stores/:id/menu
  // Garanta que este método existe e está correto
  @Get(':id/menu')
  findMenu(
    @Param('id') id: string,
    @Query('categoria') category?: string, // Aceita o filtro opcional
  ) {
    return this.storesService.findStoreMenu(id, category);
  }
}
