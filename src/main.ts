import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common'; // Importar o Logger do Nest.js

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. HABILITAR O CORS
  // Isto permite que a nossa aplicação front-end (ex: localhost:5173)
  // faça pedidos para o nosso back-end (localhost:3000)
  app.enableCors({
    origin: '*', // Em produção, devemos restringir isto ao domínio do front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Obter o ConfigService para ler as variáveis de ambiente
  const configService = app.get(ConfigService);
  const jwtSecret = configService.get<string>('JWT_SECRET');

  const logger = new Logger('Bootstrap');

  if (jwtSecret) {
    logger.log('Chave secreta JWT carregada com sucesso.');
  } else {
    logger.error('ATENÇÃO: A variável de ambiente JWT_SECRET não foi definida no ficheiro chave.env!');
  }

  await app.listen(3000);
  logger.log(`Aplicação a rodar em: ${await app.getUrl()}`);
}
bootstrap();