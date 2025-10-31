import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { DriversService } from 'src/drivers/drivers.service'; // 1. Importar o DriversService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private driversService: DriversService, // 2. Injetar o DriversService
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('A variável de ambiente JWT_SECRET não foi definida.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // 3. O payload agora inclui o 'type'
  async validate(payload: { sub: string; email: string; type: string }) {
    let userProfile;

    // 4. Verifica o tipo de utilizador a partir do payload do token
    if (payload.type === 'driver') {
      userProfile = await this.driversService.findOneById(payload.sub);
    } else if (payload.type === 'client') {
      userProfile = await this.usersService.findOneById(payload.sub);
    }

    if (!userProfile) {
      // 5. A mensagem de erro agora é mais genérica
      throw new UnauthorizedException('Token inválido ou utilizador não encontrado.');
    }
    // Retorna o perfil do cliente OU do entregador
    return userProfile;
  }
}
