import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { DriversModule } from './drivers/drivers.module'; // Importa o DriversModule
import { User } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';
import { Product } from './products/entities/product.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Driver } from './drivers/entities/driver.entity'; // Corrigido o caminho da importação

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'chave.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'projeto5',
      // 1. Adicionada a entidade Driver à lista
      entities: [User, Store, Product, CartItem, Order, OrderItem, Driver],
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    DriversModule, // Garante que o DriversModule está importado
  ],
  controllers: [AppController],
  // 2. Removido o DriverService da lista de providers
  providers: [AppService],
})
export class AppModule {}
