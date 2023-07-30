import { Injectable, Session, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { promisify } from 'util';
import * as crypto from 'crypto';
import { ObjectId } from 'mongodb';
import mongoose, { ClientSession, Model } from 'mongoose';

import { CREDENTIAL_TYPE_EMAIL, Passwd, UserBoundCredentials, } from '@/users/users.entity';
import { InjectConnection } from '@nestjs/mongoose';

const pbkdf2 = promisify(crypto.pbkdf2);
const randomBytes = promisify(crypto.randomBytes);

const HASHLEN = 32;
const HASHDIGEST = 'sha256';
const SALTLEN = 16;
const HASH_ITERATIONS = 600000;

const passhash = (pass: string, salt: string) =>
    pbkdf2(pass, salt, HASH_ITERATIONS, HASHLEN, HASHDIGEST);

@Injectable()
export class AuthService {
    constructor(
        private jwt_service: JwtService,
        @InjectConnection() private readonly connection: mongoose.Connection,
        //@InjectModel(UserBoundCredentials.name) private readonly cred_doc: Model<UserBoundCredentialsDocumentH>,
    ) { }

    async signin(email: string, passwd: string): Promise<any> {

        const cred_model = UserBoundCredentials.model(this.connection)
        const user_cred = await cred_model.findOne({
            credential_info: email
        }).populate<{ passwd: Passwd[] }>({
            path: 'passwd',
            justOne: true
        }).exec();

        const passwd_auth = user_cred?.passwd?.at(0)

        if (!passwd_auth) {
            throw new UnauthorizedException();
        }
        const derived_key = (await passhash(passwd, passwd_auth?.salt)).toString(
            'hex',
        );

        if (passwd_auth?.hash !== derived_key) {
            throw new UnauthorizedException();
        }

        const payload = {
            sub: passwd_auth.cred_id,
            id: email,
            id_type: CREDENTIAL_TYPE_EMAIL
        };
        return {
            access_token: await this.jwt_service.signAsync(payload),
        };
    }

    async updatePasswd(
        session: ClientSession,
        cred_id: ObjectId,
        pass: string,
        isnew: boolean = false
    ): Promise<any> {
        const salt: string = (await randomBytes(SALTLEN)).toString('hex');
        const hash: string = (await passhash(pass, salt)).toString('hex');

        const passwd = new Passwd();
        passwd.cred_id = cred_id;
        passwd.hash = hash;
        passwd.salt = salt;

        const passwd_model = Passwd.model(this.connection)
        if (isnew) {
            await passwd_model.create([passwd], { session });
        } else {
            await passwd_model.updateOne([passwd], { session });
        }

        return;
    }
}
