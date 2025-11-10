// Caminho: projeto-back/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common'; // Importar o ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); // Logger para mensagens de arranque

  // 1. HABILITAR O CORS
  // Permite que o front-end (localhost:5173) faça pedidos ao back-end (localhost:3000)
  app.enableCors({
    origin: '*', // Em produção, isto deve ser o seu domínio (ex: https://meusite.com)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // 2. HABILITAR A VALIDAÇÃO AUTOMÁTICA
  // Faz com que os nossos DTOs (Data Transfer Objects) funcionem
  app.useGlobalPipes(new ValidationPipe());

  // 3. VERIFICAR A CHAVE SECRETA (Boa prática de segurança)
  const configService = app.get(ConfigService);
  const jwtSecret = configService.get<string>('JWT_SECRET');

  if (jwtSecret) {
    logger.log('Chave secreta JWT carregada com sucesso.');
  } else {
    logger.error('ATENÇÃO: A variável de ambiente JWT_SECRET não foi definida no ficheiro chave.env!');
  }

  // 4. INICIAR A APLICAÇÃO
  await app.listen(3000);
  logger.log(`Aplicação a rodar em: ${await app.getUrl()}`);
}
bootstrap();
