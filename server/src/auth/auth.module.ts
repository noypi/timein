import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
    Passwd,
    PasswdSchema,
    UserBoundCredentials,
    UserBoundCredentialsSchema
} from '@/users/users.entity';


@Module({
    imports: [MongooseModule.forFeature([
        { name: Passwd.name, schema: PasswdSchema },
        { name: UserBoundCredentials.name, schema: UserBoundCredentialsSchema }])],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
