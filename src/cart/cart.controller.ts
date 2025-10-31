import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Delete, 
  Param, 
  UseGuards, 
  Request, 
  ValidationPipe 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart') // Define o prefixo /cart para todas as rotas
@UseGuards(AuthGuard('jwt')) // Protege TODAS as rotas neste controlador
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // --- Método Auxiliar Privado ---
  // Formata a resposta do carrinho para ser consistente
  private async formatCartResponse(userId: string) {
    const cartItems = await this.cartService.findByUserId(userId);
    
    // Mapeia os itens para incluir detalhes do produto
    const items = cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
    }));

    // Calcula o subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return { items, subtotal: subtotal.toFixed(2) };
  }

  // --- Rotas Públicas ---

  /**
   * Rota: GET /cart
   * Obtém o carrinho completo do utilizador logado.
   */
  @Get()
  async getCart(@Request() req) {
    // req.user é injetado pela nossa JwtStrategy (AuthGuard)
    return this.formatCartResponse(req.user.id);
  }

  /**
   * Rota: POST /cart/add
   * Adiciona um item (ou incrementa a quantidade) ao carrinho.
   */
  @Post('add')
  async addItem(@Request() req, @Body(ValidationPipe) addCartItemDto: AddCartItemDto) {
    await this.cartService.addItem(req.user.id, addCartItemDto);
    return this.formatCartResponse(req.user.id); // Retorna o carrinho atualizado
  }

  /**
   * Rota: PUT /cart/update/:productId
   * Atualiza a quantidade de um item específico no carrinho.
   */
  @Put('update/:productId')
  async updateItemQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body(ValidationPipe) updateDto: UpdateCartItemDto,
  ) {
    await this.cartService.updateItemQuantity(req.user.id, productId, updateDto);
    return this.formatCartResponse(req.user.id); // Retorna o carrinho atualizado
  }

  /**
   * Rota: DELETE /cart/remove/:productId
   * Remove um item específico do carrinho.
   */
  @Delete('remove/:productId')
  async removeItem(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    await this.cartService.removeItem(req.user.id, productId);
    return this.formatCartResponse(req.user.id); // Retorna o carrinho atualizado
  }

  /**
   * Rota: DELETE /cart/clear
   * Esvazia completamente o carrinho do utilizador.
   */
  @Delete('clear')
  async clearCart(@Request() req) {
    await this.cartService.clearCart(req.user.id);
    return this.formatCartResponse(req.user.id); // Retorna o carrinho atualizado (vazio)
  }
}