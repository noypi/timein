import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, HydratedDocument, Types } from 'mongoose';

export const CREDENTIAL_TYPE_EMAIL = 1

@Schema({ collection: 'user_info' })
export class UserInfo {
    @Prop({ required: true })
    cred_id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    familyname: string;

    public static model(connection: Connection) {
        return connection.model(UserInfo.name, UserInfoSchema)
    }
}

@Schema({ collection: 'user_bound_credentials' })
export class UserBoundCredentials {
    @Prop({ required: true })
    _id: Types.ObjectId;

    @Prop({ required: true })
    credential_type: number;

    @Prop({ required: true })
    credential_info: string

    public static model(connection: Connection) {
        return connection.model(UserBoundCredentials.name, UserBoundCredentialsSchema)
    }
}

@Schema({ collection: 'passwd_auth' })
export class Passwd {
    @Prop({ required: true })
    cred_id: Types.ObjectId;

    @Prop({ required: true })
    @Prop()
    hash: string;

    @Prop({ required: true })
    @Prop()
    salt: string;

    public static model(connection: Connection) {
        return connection.model(Passwd.name, PasswdSchema)
    }

}

@Schema({ collection: 'credentials_type' })
export class CredentialsType {
    @Prop({ required: true })
    type: number;

    @Prop({ required: true })
    @Prop()
    name: string;

    public static model(connection: Connection) {
        return connection.model(CredentialsType.name, CredentialsTypeSchema)
    }

}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo)
export const UserBoundCredentialsSchema = SchemaFactory.createForClass(UserBoundCredentials)
export const PasswdSchema = SchemaFactory.createForClass(Passwd)
export const CredentialsTypeSchema = SchemaFactory.createForClass(CredentialsType)

export type UserInfoDocument = UserInfo & Document
export type UserBoundCredentialsDocument = UserBoundCredentials & Document
export type PasswdDocument = Passwd & Document
export type CredentialsTypeDocument = CredentialsType & Document

export type UserInfoDocumentH = HydratedDocument<UserInfo>
export type UserBoundCredentialsDocumentH = HydratedDocument<UserBoundCredentials>
export type PasswdDocumentH = HydratedDocument<Passwd>
export type CredentialsTypeDocumentH = HydratedDocument<CredentialsType>


PasswdSchema.index(
    { "cred_id": 1 }, { "unique": true }
)
UserInfoSchema.index(
    { "cred_id": 1 }, { "unique": true }
)
UserBoundCredentialsSchema.index(
    { "credential_type": 1, "credential_info": 1 },
    { "unique": true }
)
CredentialsTypeSchema.index(
    { type: 1 }, { unique: true }
)

UserBoundCredentialsSchema.virtual('passwd', {
    ref: Passwd.name,
    localField: '_id',
    foreignField: 'cred_id'
})