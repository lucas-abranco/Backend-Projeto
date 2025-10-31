import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator'; // Importa validadores

export class AddCartItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string; // ID do produto a ser adicionado

  @IsNotEmpty()
  @IsInt() // Garante que a quantidade é um número inteiro
  @Min(1) // Garante que a quantidade é pelo menos 1
  quantity: number; // Quantidade a ser adicionada
}
