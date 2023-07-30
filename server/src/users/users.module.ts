import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import {
    Passwd,
    PasswdSchema,
    UserBoundCredentials,
    UserBoundCredentialsSchema,
    UserInfo,
    UserInfoSchema
} from './users.entity';
import { AuthModule } from '@/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: UserInfo.name, schema: UserInfoSchema },
            { name: UserBoundCredentials.name, schema: UserBoundCredentialsSchema },
            { name: Passwd.name, schema: PasswdSchema }
        ])],
    controllers: [UserController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
