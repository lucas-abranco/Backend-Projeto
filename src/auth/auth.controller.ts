// Caminho: projeto-back/src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Patch, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto'; // 1. Importar o novo DTO

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- Rotas de Cliente ---
  @Post('client/register')
  registerClient(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.registerClient(createUserDto);
  }

  @Post('client/login')
  loginClient(@Body() loginDto: LoginDto) {
    return this.authService.loginClient(loginDto.email, loginDto.password);
  }

  // --- Rotas de Entregador ---
  @Post('driver/register')
  registerDriver(@Body(ValidationPipe) createDriverDto: CreateDriverDto) {
    return this.authService.registerDriver(createDriverDto);
  }

  @Post('driver/login')
  loginDriver(@Body() loginDto: LoginDto) {
    return this.authService.loginDriver(loginDto.email, loginDto.password);
  }

  // --- Rotas de Perfil (Geral) ---
  
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * NOVO ENDPOINT (CORREÇÃO DO ERRO 404)
   * Rota: PATCH /auth/profile
   * Atualiza o perfil do utilizador (cliente ou entregador).
   */
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  updateProfile(
    @Request() req, // Obtém o 'user' do token
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto, // Valida os dados
  ) {
    // A nossa JwtStrategy (que vamos rever) devolve { ...profile, type: '...' }
    const { id, type } = req.user; 
    return this.authService.updateProfile(id, type, updateProfileDto);
  }
}
