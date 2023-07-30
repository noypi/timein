import { Module, MiddlewareConsumer, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RequestLoggerMiddleware } from './middleware/request-logger';

import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: config_factory,
            inject: [ConfigService],
        }),
        JwtModule.register({
            global: true,
            signOptions: { expiresIn: '999999m' },
            secret: 'some secret',
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}


async function config_factory(cfg: ConfigService) {
    const config = {
        uri: cfg.get(`MONGODB_URL`),
        useUnifiedTopology: cfg.get(`MONGODB_SYNCHRONIZE`),
        useNewUrlParser: cfg.get(`MONGODB_USENEWURLPARSER`)
    }

    console.log(config)

    return config
}