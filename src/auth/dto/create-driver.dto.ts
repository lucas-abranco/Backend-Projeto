// Este DTO define os dados esperados para o registo de um entregador
export class CreateDriverDto {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  password: string;
  vehicleType?: string;
  licensePlate?: string;
  cnh?: string;
}
