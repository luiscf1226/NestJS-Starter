import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'The new status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus, {
    message: 'Status must be one of: active, inactive, pending',
  })
  status: UserStatus;
} 