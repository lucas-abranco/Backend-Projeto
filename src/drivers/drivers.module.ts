import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  providers: [DriversService],
  exports: [DriversService], // Exporta o serviço para ser usado pelo AuthModule
})
export class DriversModule {}
