import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The email address of the user', example: 'john@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'The full name of the user', example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The hashed password of the user' })
  @Column()
  password: string;

  @ApiProperty({ 
    description: 'The status of the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE 
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  status: UserStatus;

  @ApiProperty({ description: 'The timestamp when the user was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The timestamp when the user was last updated' })
  @UpdateDateColumn()
  updated_at: Date;
} 