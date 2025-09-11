import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'Ali' })
  username: string;
  @ApiProperty({ example: 'password' })
  password: string;
}
