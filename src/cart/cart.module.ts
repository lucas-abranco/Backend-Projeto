import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity'; // 1. Importar a entidade Product

@Module({
  imports: [
    // 2. CORREÇÃO AQUI:
    // O CartService precisa de injetar o repositório de Product
    // para verificar se um produto existe. Por isso, precisamos de
    // registar a entidade Product aqui, juntamente com a CartItem.
    TypeOrmModule.forFeature([CartItem, Product]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}