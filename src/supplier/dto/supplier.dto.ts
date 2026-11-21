import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'CTy',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: '0912345678',
  })
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Phone number is invalid',
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'HN',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
