import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  @ApiProperty({
    example: 'Đồ uống',
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Nước ngọt...',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
