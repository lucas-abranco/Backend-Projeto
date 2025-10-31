import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { DriversService } from 'src/drivers/drivers.service'; // 1. Importar o DriversService
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDriverDto } from './dto/create-driver.dto'; // 2. Importar o DTO do Entregador

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private driversService: DriversService, // 3. Injetar o DriversService
    private jwtService: JwtService,
  ) {}

  // --- Lógica de Cliente ---
  async registerClient(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('O e-mail ou CPF já está a ser utilizado.');
      }
      throw error;
    }
  }

  async loginClient(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciais de cliente inválidas.');
    }
    const payload = { sub: user.id, email: user.email, type: 'client' }; // Adiciona o tipo ao token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // --- Lógica de Entregador (QUE ESTAVA EM FALTA) ---

  async registerDriver(createDriverDto: CreateDriverDto) {
    try {
      const driver = await this.driversService.create(createDriverDto);
      return driver;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('O e-mail ou CPF já está a ser utilizado.');
      }
      throw error;
    }
  }

  async loginDriver(email: string, pass: string) {
    const driver = await this.driversService.findOneByEmail(email);
    if (!driver || !(await bcrypt.compare(pass, driver.password))) {
      throw new UnauthorizedException('Credenciais de entregador inválidas.');
    }
    const payload = { sub: driver.id, email: driver.email, type: 'driver' }; // Adiciona o tipo ao token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
