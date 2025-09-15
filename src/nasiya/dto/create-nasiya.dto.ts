import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NasiyaStatus } from 'src/enums/nasiya';

export class CreateNasiyaDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Valiyev' })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '352099001761481' })
  @IsString()
  @IsNotEmpty()
  phoneImei: string;

  @ApiProperty({ example: 'iPhone 14 Pro' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 'f71b8c73-2fcd-4e6a-9d24-1b65a8c45a77' })
  @IsString()
  @IsNotEmpty()
  passportId: string;

  @ApiProperty({ example: '1234567', description: 'Pasportning raqam qismi' })
  @IsString()
  @Length(7, 7, { message: 'passportCode 7 ta belgidan iborat bo‘lishi kerak' })
  passportCode: string;

  @ApiProperty({ example: 'https://site.com/images/user.png', required: false })
  @IsOptional()
  @IsString()
  userImage?: string;

  @ApiProperty({
    example: 'https://site.com/images/product.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  productImage?: string;

  @ApiProperty({ example: 9, description: 'Muddat (oylarda)' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  time: number;

  @ApiHideProperty()
  status: NasiyaStatus = NasiyaStatus.PENDING;

  @ApiHideProperty()
  userId: string;
}
