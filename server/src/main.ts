import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module'
import * as express from 'express'

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.use('/uploads', express.static('uploads'));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();
    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}

bootstrap();
