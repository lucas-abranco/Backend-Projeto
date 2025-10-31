import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from 'src/auth/dto/create-driver.dto'; // Importaremos este DTO do módulo 'auth'

@Injectable()
export class DriversService {
  constructor(
    // Injeta o repositório para a entidade Driver
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
  ) {}

  /**
   * Cria um novo entregador na base de dados
   */
  async create(createDriverDto: CreateDriverDto): Promise<Omit<Driver, 'password'>> {
    const { name, cpf, phone, email, password, ...rest } = createDriverDto;

    // Encripta a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria a nova entidade
    const driver = this.driversRepository.create({
      id: uuid(),
      name,
      cpf,
      phone,
      email,
      password: hashedPassword,
      ...rest, // Inclui os campos opcionais (vehicleType, licensePlate, cnh)
    });

    // Salva na base de dados
    await this.driversRepository.save(driver);
    
    // Retorna o objeto sem a senha
    const { password: _, ...result } = driver;
    return result;
  }

  /**
   * Encontra um entregador pelo e-mail (usado para o login)
   * Seleciona explicitamente a senha, pois é necessária para a verificação.
   */
  async findOneByEmail(email: string): Promise<Driver | null> {
    return this.driversRepository
      .createQueryBuilder('driver')
      .where('driver.email = :email', { email })
      .addSelect('driver.password') // Garante que a senha seja selecionada
      .getOne();
  }

  /**
   * Encontra um entregador pelo ID (usado para o perfil)
   * Retorna o objeto sem a senha.
   */
  async findOneById(id: string): Promise<Omit<Driver, 'password'> | null> {
    const driver = await this.driversRepository.findOne({ where: { id } });
    if (driver) {
      const { password, ...result } = driver;
      return result;
    }
    return null;
  }
}
