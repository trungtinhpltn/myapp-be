import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty({ enum: Role })
  role: Role;
}

export class TokenResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
