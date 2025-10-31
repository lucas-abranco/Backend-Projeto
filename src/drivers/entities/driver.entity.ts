import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('drivers') // Mapeia esta classe para a tabela 'drivers'
export class Driver {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'vehicle_type', type: 'varchar', length: 100, nullable: true })
  vehicleType: string;

  @Column({ name: 'license_plate', type: 'varchar', length: 20, nullable: true })
  licensePlate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cnh: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
