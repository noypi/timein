import { Injectable, ConflictException, Logger, HttpException, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose, { ClientSession, Model } from 'mongoose';

import { UserCreateDto } from '@/users/dto';
import { AuthService } from '@/auth/auth.service';
import {
    CREDENTIAL_TYPE_EMAIL,
    UserBoundCredentials,
    UserBoundCredentialsDocument,
    UserBoundCredentialsDocumentH,
    UserBoundCredentialsSchema,
    UserInfo,
    UserInfoDocument,
    UserInfoDocumentH,
    UserInfoSchema
} from './users.entity';


@Injectable()
export class UsersService {
    private readonly logger: Logger = new Logger(UsersService.name)

    constructor(
        private auth_svc: AuthService,
        // @InjectModel(UserBoundCredentials.name) private readonly cred_doc: Model<UserBoundCredentialsDocumentH>,
        // @InjectModel(UserInfo.name) private readonly user_doc: Model<UserInfoDocumentH>,
        @InjectConnection() private readonly connection: mongoose.Connection,
    ) { }

    async createUser(user: UserCreateDto): Promise<void> {

        // transactions are not supported for standalone mongodb
        const sess = await this.connection.startSession()
        const result = await sess.withTransaction(async (session: ClientSession) => {

            await this.validate_email(session, user.email);


            const cred = new UserBoundCredentials()
            cred._id = new ObjectId()
            cred.credential_info = user.email;
            cred.credential_type = CREDENTIAL_TYPE_EMAIL;

            const new_user = new UserInfo();
            new_user.cred_id = cred._id;
            new_user.familyname = user.familyname;
            new_user.name = user.name;

            const user_model = UserInfo.model(this.connection);
            const cred_model = UserBoundCredentials.model(this.connection);

            await Promise.all([
                user_model.create([new_user], { session }),
                cred_model.create([cred], { session }),
                this.auth_svc.updatePasswd(session, cred._id, user.password, true)
            ])

        }).catch(async (e: any) => {
            this.logger.error(e)
            if (!(e instanceof HttpException)) {
                e = new InternalServerErrorException('');
            }
            return e
        });

        return result
    }

    async validate_email(
        session: ClientSession, //EntityManager,
        email: string,
    ): Promise<any> {

        const model = UserBoundCredentials.model(this.connection)
        const user = await model.findOne({
            credential_type: CREDENTIAL_TYPE_EMAIL,
            credential_info: email

        }, null, { session }).catch(e => {
            throw e
        });

        if (user) {
            throw new ConflictException('User already exist');
        }
    }
}
