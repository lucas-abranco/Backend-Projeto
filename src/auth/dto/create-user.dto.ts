export class CreateUserDto {
  name: string;
  cpf: string;
  phone?: string; // O '?' indica que este campo é opcional
  email: string;
  password: string;
}
