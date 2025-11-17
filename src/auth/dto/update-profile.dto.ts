// Caminho: projeto-back/src/auth/dto/update-profile.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

// Define os campos que o front-end pode enviar para atualizar
// Usamos 'IsOptional' porque o utilizador pode querer mudar só o nome, ou só a senha.
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Se o 'newPassword' for fornecido, o 'currentPassword' também deve ser
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'A nova senha deve ter pelo menos 8 caracteres' })
  newPassword?: string;
}