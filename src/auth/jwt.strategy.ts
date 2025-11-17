// Caminho: projeto-back/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { DriversService } from 'src/drivers/drivers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private driversService: DriversService,
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

  // O payload do token (que criámos no auth.service) contém o 'type'
  async validate(payload: { sub: string; email: string; type: string }) {
    let userProfile;

    // Procura na tabela correta com base no 'type'
    if (payload.type === 'driver') {
      userProfile = await this.driversService.findOneById(payload.sub);
    } else if (payload.type === 'client') {
      userProfile = await this.usersService.findOneById(payload.sub);
    }

    if (!userProfile) {
      throw new UnauthorizedException('Token inválido ou utilizador não encontrado.');
    }
    
    // CORREÇÃO: Retorna o perfil E o tipo.
    // O 'req.user' no controlador será agora: { id: '...', name: '...', type: 'client' }
    return { ...userProfile, type: payload.type };
  }
}