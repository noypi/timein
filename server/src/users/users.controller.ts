import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    HttpException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto } from '@/users/dto';

@Controller('user')
export class UserController {

    private readonly logger = new Logger(UserController.name)
    constructor(private userSvc: UsersService) { }

    @HttpCode(HttpStatus.OK)
    @Post('create')
    async create(@Body() user: UserCreateDto): Promise<void> {
        const result: any = await this.userSvc.createUser(user)
            .catch(e => {
                if (!(e instanceof HttpException)) {
                    this.logger.error(e)
                    e = new InternalServerErrorException('')
                }
                throw e
            });
        this.handleResult(result);

        return result;
    }

    handleResult(result: any) {
        if (result && result instanceof HttpException) {
            throw result;
        }
    }
}
