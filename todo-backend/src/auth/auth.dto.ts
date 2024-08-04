import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refreshToken123', description: 'Refresh token' })
  refreshToken: string;
}

export class TokensResponseDto {
  @ApiProperty({ example: 'accessToken123', description: 'New access token' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken123', description: 'New refresh token' })
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'accessToken123', description: 'Access token' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken123', description: 'Refresh token' })
  refreshToken: string;
}
