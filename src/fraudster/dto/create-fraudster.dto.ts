import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsOptional,
  Max,
} from 'class-validator';
import { PassportSeriya, Type } from 'src/enums/passport';

export class CreateFraudsterDto {
  @ApiProperty({ example: 'Ali', description: 'Firibgar ismi' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'Valiyev', description: 'Firibgar familiyasi' })
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty({
    example: 'AD',
    description: 'Passport seriyasi',
  })
  @IsEnum(PassportSeriya)
  passportSeriya: string;

  @ApiProperty({ example: '1234567', description: 'Pasportning raqam qismi' })
  @IsString()
  @Length(7, 7, { message: 'passportCode 7 ta belgidan iborat bo‘lishi kerak' })
  passportCode: string;

  @ApiProperty({ example: 'NasiyaMijoz' })
  @IsEnum(Type)
  type: string;

  @IsOptional()
  @Max(13)
  time: number;
}
