import { IsNotEmpty, IsInt, Min } from 'class-validator';

// Esta classe define que, para atualizar um item,
// esperamos receber apenas a nova quantidade.
export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsInt() // Garante que o valor é um número inteiro
  @Min(1) // Garante que a quantidade não pode ser 0 ou negativa
  quantity: number;
}
