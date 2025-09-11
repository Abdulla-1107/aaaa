import { ApiProperty } from '@nestjs/swagger';

export class CreatePassportDto {
  @ApiProperty({
    example: 'AD',
    description: 'Pasport seriyasi (masalan: AD, AB, AC)',
  })
  series: string;
}
