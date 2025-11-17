// Caminho: projeto-back/src/users/users.service.ts
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

  /**
   * Cria um novo utilizador (Cliente).
   */
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

  /**
   * Encontra um utilizador pelo e-mail (usado para o LOGIN).
   * CORREÇÃO: Usa QueryBuilder para selecionar explicitamente a senha.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user') // Cria um construtor de query para 'user'
      .where('user.email = :email', { email }) // Filtra pelo e-mail
      .addSelect('user.password') // Garante que a coluna 'password' seja incluída
      .getOne(); // Executa e obtém o resultado
  }

  /**
   * Encontra um utilizador pelo ID (usado para o GET /profile).
   * Retorna o utilizador SEM a senha.
   */
  async findOneById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * NOVO MÉTODO (Faltante)
   * Encontra um utilizador pelo ID (usado para ATUALIZAR o perfil).
   * Retorna o utilizador COM a senha (para verificação da senha atual).
   */
  async findOneByIdWithPassword(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
  }

  /**
   * NOVO MÉTODO (Faltante)
   * Atualiza os dados do utilizador.
   */
  async update(id: string, updateData: Partial<User>): Promise<Omit<User, 'password'> | null> {
    await this.usersRepository.update(id, updateData);
    // O findOneById pode retornar null, e agora a função aceita isso.
    return this.findOneById(id);
  }
}
