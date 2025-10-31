import { 
  Controller, 
  Get, 
  Post, 
  Patch, // Usamos PATCH para atualizações parciais (mudar o status)
  Body, 
  Param, 
  UseGuards, 
  Request, 
  ValidationPipe 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders') // Define o prefixo /orders para todas as rotas
@UseGuards(AuthGuard('jwt')) // Protege TODAS as rotas neste controlador
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Rota: POST /orders
   * Cliente: Cria um novo pedido a partir do carrinho.
   */
  @Post()
  create(
    @Request() req, // Obtém o 'user' do token
    @Body(ValidationPipe) createOrderDto: CreateOrderDto, // Valida os dados do corpo
  ) {
    const userId = req.user.id;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  /**
   * Rota: GET /orders
   * Cliente: Busca o seu histórico de pedidos.
   */
  @Get()
  findUserOrders(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.findOrdersByUserId(userId);
  }

  /**
   * Rota: GET /orders/available
   * Entregador: Busca pedidos disponíveis para entrega.
   */
  @Get('available')
  findAvailableOrders() {
    return this.ordersService.findAvailableOrders();
  }

  /**
   * Rota: PATCH /orders/:id/accept
   * Entregador: Aceita um pedido.
   */
  @Patch(':id/accept')
  acceptOrder(
    @Request() req, // Obtém o 'user' (entregador) do token
    @Param('id') orderId: string, // Obtém o ID do pedido da URL
  ) {
    const driverId = req.user.id;
    return this.ordersService.acceptOrder(orderId, driverId);
  }

  /**
   * Rota: PATCH /orders/:id/complete
   * Entregador: Finaliza um pedido.
   */
  @Patch(':id/complete')
  completeOrder(
    @Request() req, // Obtém o 'user' (entregador) do token
    @Param('id') orderId: string, // Obtém o ID do pedido da URL
  ) {
    const driverId = req.user.id;
    return this.ordersService.completeOrder(orderId, driverId);
  }
}
