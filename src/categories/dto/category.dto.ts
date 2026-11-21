import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  @ApiProperty({
    example: 'Đồ uống',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Nước ngọt...',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
