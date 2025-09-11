import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  IsUrl,
} from 'class-validator';

export class CreateFraudsterDto {
  @ApiProperty({ example: 'Ali', description: 'Firibgar ismi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Valiyev', description: 'Firibgar familiyasi' })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Rasm URL manzili',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Rasm URL noto‘g‘ri formatda kiritilgan' })
  image: string;

  @ApiProperty({
    example: 'uuid-passport-id',
    description: 'Passport seriyasining ID si',
  })
  @IsUUID()
  passportId: string;

  @ApiProperty({ example: '1234567', description: 'Pasportning raqam qismi' })
  @IsString()
  @Length(7, 7, { message: 'passportCode 7 ta belgidan iborat bo‘lishi kerak' })
  passportCode: string;

  @ApiProperty({ example: 'Toshkent', description: 'Manzili' })
  @IsString()
  location: string;

  @ApiProperty({
    example: 'Firibgarlik qilganlikda gumon qilinmoqda',
    description: 'Izoh',
  })
  @IsString()
  description: string;
}
