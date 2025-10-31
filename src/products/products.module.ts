import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity'; // Importa a entidade Product

@Module({
  // Regista a entidade Product com o TypeORM,
  // permitindo que injetemos o repositório correspondente no serviço.
  imports: [TypeOrmModule.forFeature([Product])],
  // Declara o ProductsService como um provider deste módulo.
  providers: [ProductsService],
  // Exporta o ProductsService para que ele possa ser usado
  // em outros módulos que importem o ProductsModule.
  exports: [ProductsService],
})
export class ProductsModule {}
