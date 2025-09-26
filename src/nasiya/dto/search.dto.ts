import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchQuery {
  @ApiProperty({ example: 'uuid' })
  @IsNotEmpty()
  passportId: string;
  @ApiProperty({ example: '1234567' })
  @IsNotEmpty()
  passportCode: string;
}
