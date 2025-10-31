// Este ficheiro é a representação da nossa tabela 'users' no código.
// O TypeORM usa esta classe para saber como ler e escrever na base de dados.
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('users') // Diz ao TypeORM que esta classe está ligada à tabela 'users'
export class User {
  // @PrimaryColumn define esta propriedade como a chave primária da tabela
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  // @Column mapeia esta propriedade para uma coluna com o mesmo nome
  @Column({ type: 'varchar', length: 255 })
  name: string;

  // unique: true garante que não haverá dois utilizadores com o mesmo CPF
  @Column({ type: 'varchar', length: 14, unique: true })
  cpf: string;

  // nullable: true permite que esta coluna tenha valores nulos (vazios)
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  // @CreateDateColumn preenche automaticamente esta coluna com a data de criação
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
