import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { PassportSeriya } from 'src/enums/passport';

export class SearchQueryDto {
  @ApiProperty({
    enum: PassportSeriya,
    example: 'AD',
    description: 'Foydalanuvchining pasport seriyasi (enum orqali tanlanadi)',
  })
  @IsEnum(PassportSeriya)
  @IsNotEmpty()
  @IsString()
  passportSeriya: string;

  @ApiProperty({
    example: '1234567',
    description: '7 xonali pasport kodi',
  })
  @IsString()
  @Length(7, 7, { message: 'Passport code must be 7 digits' })
  passportCode: string;
}
