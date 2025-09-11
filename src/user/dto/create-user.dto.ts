import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/enums/userRole';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali', description: 'Foydalanuvchining ismi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'ali123', description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '123456', description: 'Parol (kamida 6 ta belgi)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+998991234567', description: 'Telefon raqami' })
  @IsNotEmpty()
  @IsPhoneNumber('UZ') // faqat O‘zbekiston raqamlarini tekshiradi
  phone: string;

  @ApiProperty({
    example: 'USER',
    description: 'Role (admin, user va h.k.)',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  @IsString()
  role?: string;
}
