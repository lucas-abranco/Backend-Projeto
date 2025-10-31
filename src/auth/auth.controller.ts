import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDriverDto } from './dto/create-driver.dto'; // 1. Importar o DTO do Entregador
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- Rotas de Cliente ---
  @Post('client/register')
  registerClient(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerClient(createUserDto);
  }

  @Post('client/login')
  loginClient(@Body() loginDto: LoginDto) {
    return this.authService.loginClient(loginDto.email, loginDto.password);
  }

  // --- NOVAS Rotas de Entregador ---
  @Post('driver/register') // 2. Rota para registar entregador
  registerDriver(@Body() createDriverDto: CreateDriverDto) {
    return this.authService.registerDriver(createDriverDto);
  }

  @Post('driver/login') // 3. Rota para login de entregador
  loginDriver(@Body() loginDto: LoginDto) {
    return this.authService.loginDriver(loginDto.email, loginDto.password);
  }

  // --- Rota de Perfil (Geral) ---
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
