import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiProperty({
    description: 'The status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus, {
    message: 'Status must be one of: active, inactive, pending',
  })
  status?: UserStatus;
} 