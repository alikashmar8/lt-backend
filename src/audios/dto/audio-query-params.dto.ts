import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AudioQueryParamsDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  take: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  random?: boolean;

  @IsOptional()
  @IsString()
  singerId?: string;

  @IsOptional()
  @IsString()
  postId?: string;
}
