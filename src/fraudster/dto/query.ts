// fraudster/dto/fraudster-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FraudsterQueryDto {
  @ApiPropertyOptional({
    description: 'Ism yoki familiya bo‘yicha qidirish',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Passport raqami bo‘yicha filter',
  })
  @IsOptional()
  @IsString()
  passportCode?: string;

  @ApiPropertyOptional({
    description: 'Manzil bo‘yicha filter',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Sahifa raqami (pagination)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Har sahifada nechta element chiqarish (pagination)',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
