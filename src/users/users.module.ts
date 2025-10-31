import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  // 1. Importa o TypeOrmModule.forFeature([User]).
  //    Isto regista a entidade User com o TypeORM, permitindo
  //    que o UsersService injete o repositório correspondente.
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // 2. Exporta o UsersService.
  //    Isto torna o UsersService disponível para qualquer outro módulo
  //    que importe o UsersModule (neste caso, o nosso AuthModule).
  exports: [UsersService],
})
export class UsersModule {}
