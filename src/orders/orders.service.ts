// Caminho: projeto-back/src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
// A linha 'import { OrdersService } from './orders.service';' (que causava o erro) foi removida.

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const { storeId, deliveryAddress, deliveryFee } = createOrderDto;

    const cartItems = await this.cartItemRepository.find({
      where: { userId },
      relations: ['product'],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('O seu carrinho está vazio.');
    }

    let subtotal = 0;
    for (const item of cartItems) {
      if (!item.product) {
        throw new NotFoundException(`Produto com ID ${item.productId} não encontrado.`);
      }
      subtotal += item.product.price * item.quantity;
    }
    const totalPrice = subtotal + deliveryFee;

    const order = this.orderRepository.create({
      id: uuid(),
      userId,
      storeId,
      deliveryAddress,
      deliveryFee,
      totalPrice,
      status: 'Em andamento',
    });

    await this.orderRepository.save(order);

    const orderItems = cartItems.map(cartItem => {
      return this.orderItemRepository.create({
        id: uuid(),
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        pricePerUnit: cartItem.product.price,
      });
    });

    await this.orderItemRepository.save(orderItems);
    await this.cartItemRepository.delete({ userId });

    return order;
  }

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product', 'store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAvailableOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { 
        status: 'Em andamento', 
        driverId: IsNull()
      },
      relations: ['store'],
      order: { createdAt: 'ASC' },
    });
  }

  async acceptOrder(orderId: string, driverId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Pedido com ID "${orderId}" não encontrado.`);
    }

    if (order.status !== 'Em andamento' || order.driverId !== null) {
      throw new BadRequestException('Este pedido não está mais disponível.');
    }

    order.driverId = driverId;
    order.status = 'Em rota de entrega';
    
    return this.orderRepository.save(order);
  }

  async completeOrder(orderId: string, driverId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Pedido com ID "${orderId}" não encontrado.`);
    }

    if (order.driverId !== driverId) {
      throw new UnauthorizedException('Você não tem permissão para completar este pedido.');
    }

    if (order.status !== 'Em rota de entrega') {
      throw new BadRequestException('Este pedido não pode ser finalizado pois não está em rota de entrega.');
    }

    order.status = 'Entregue';
    order.completedAt = new Date();
    
    return this.orderRepository.save(order);
  }
}
