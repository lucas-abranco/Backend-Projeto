import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { name, cpf, phone, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      id: uuid(),
      name,
      cpf,
      phone,
      email,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    const { password: _, ...result } = user;
    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // NOVO MÉTODO: Encontra um utilizador pelo seu ID
  // Esta é a função que estava em falta e que a sua JwtStrategy precisa.
  async findOneById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
