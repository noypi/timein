import { IsNotEmpty, IsString, IsOptional, IsEmail, isEmail } from 'class-validator';

export class UserCreateDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Invlaid User Email' })
    readonly email: string;

    @IsString()
    @IsNotEmpty({ message: 'Invalid User Password' })
    readonly password: string;

    @IsString()
    @IsNotEmpty({ message: 'Invlaid User Name' })
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly familyname: string;


}
