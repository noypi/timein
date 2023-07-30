import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Request,
    Get,
    UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Logger, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserLoginDto } from '@/users/dto/user-login.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(
        private auth_service: AuthService,
        private jwt_service: JwtService,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signin(@Body() signin_dto: UserLoginDto) {
        const result = await this.auth_service
            .signin(signin_dto.email, signin_dto.password)
            .catch((e) => {
                throw e;
            });

        return result;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('islogin')
    async isLogin(@Request() req: any) {
        return req.user;
    }
}
