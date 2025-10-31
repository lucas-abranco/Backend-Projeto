import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  // O ID do estabelecimento de onde o pedido está a ser feito
  @IsNotEmpty()
  @IsString()
  storeId: string;

  // O endereço de entrega que o cliente confirmou
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  // A taxa de entrega (pode ser enviada pelo front-end ou calculada no back-end)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  deliveryFee: number;
}
