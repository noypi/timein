import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

const dotenv = config({
    path: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`,
});

expand(dotenv);

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn']
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(process.env.SERVERPORT || 4000);
}
bootstrap();
