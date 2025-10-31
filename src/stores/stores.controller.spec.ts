import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores') // Define o prefixo '/stores' para todas as rotas
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // Rota para GET /stores
  // Busca e retorna a lista de todos os estabelecimentos.
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  // Rota para GET /stores/:id
  // Busca e retorna os detalhes de um estabelecimento específico pelo seu ID.
  @Get(':id')
  // @Param('id') extrai o ID da URL (ex: 'pizzaria-bella').
  findOne(@Param('id') id: string) {
    return this.storesService.findOneById(id);
  }

  // Rota para GET /stores/:id/menu
  // Busca e retorna os detalhes de um estabelecimento E o seu menu.
  // Aceita um filtro opcional de categoria na URL (ex: /stores/pizzaria-bella/menu?categoria=Pizza).
  @Get(':id/menu')
  // @Query('categoria') extrai o valor do parâmetro 'categoria' da URL, se ele existir.
  findMenu(
    @Param('id') id: string,
    @Query('categoria') category?: string, // O '?' indica que o parâmetro é opcional
  ) {
    // Chama o serviço, passando o ID da loja e o filtro de categoria (se houver).
    return this.storesService.findStoreMenu(id, category);
  }
}
