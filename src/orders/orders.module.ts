import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsModule } from 'src/products/products.module';
import { CartModule } from 'src/cart/cart.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    // Regista todas as entidades que o OrdersService precisa de injetar
    // para ler o carrinho (CartItem, Product) e escrever o pedido (Order, OrderItem).
    TypeOrmModule.forFeature([Order, OrderItem, CartItem, Product]),
    // Importa os módulos cujos serviços são necessários
    ProductsModule,
    CartModule,
  ],
  controllers: [OrdersController], // Declara o controlador deste módulo
  providers: [OrdersService], // Declara o serviço deste módulo
})
export class OrdersModule {}
