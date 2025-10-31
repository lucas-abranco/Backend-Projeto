import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from './entities/store.entity';
import { ProductsModule } from 'src/products/products.module'; // Importa o módulo de produtos

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]), // Regista a entidade Store
    ProductsModule, // Importa o ProductsModule para que StoresService possa injetar ProductsService
  ],
  controllers: [StoresController], // Declara o controlador deste módulo
  providers: [StoresService], // Declara o serviço deste módulo
})
export class StoresModule {}
