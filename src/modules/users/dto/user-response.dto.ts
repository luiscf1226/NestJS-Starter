import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'The date and time when the user was created',
    example: '2023-07-15T14:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The date and time when the user was last updated',
    example: '2023-07-15T14:30:00Z',
  })
  updated_at: Date;
} 