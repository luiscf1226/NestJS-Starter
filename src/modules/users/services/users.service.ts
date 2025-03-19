import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User, UserStatus } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  private transformToResponse(user: User): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id;
    response.email = user.email;
    response.name = user.name;
    response.status = user.status;
    response.created_at = user.created_at;
    response.updated_at = user.updated_at;
    return response;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map(user => this.transformToResponse(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.transformToResponse(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.create({
      ...createUserDto,
      status: createUserDto.status || UserStatus.PENDING,
    });
    return this.transformToResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findOne(id);
    
    // If updating status, validate the transition
    if (updateUserDto.status && updateUserDto.status !== existingUser.status) {
      this.validateStatusTransition(existingUser.status, updateUserDto.status);
    }
    
    const updatedUser = await this.usersRepository.create({
      ...existingUser,
      ...updateUserDto,
      id,
    });
    return this.transformToResponse(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersRepository.remove(id);
  }

  // Status-related methods
  async updateStatus(id: number, status: UserStatus): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Validate status transition
    this.validateStatusTransition(user.status, status);
    
    const updatedUser = await this.usersRepository.updateUserStatus(id, status);
    return this.transformToResponse(updatedUser);
  }

  async findActiveUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findUsersWithDetails();
    return users.map(user => this.transformToResponse(user));
  }

  private validateStatusTransition(currentStatus: UserStatus, newStatus: UserStatus): void {
    const validTransitions: Record<UserStatus, UserStatus[]> = {
      [UserStatus.PENDING]: [UserStatus.ACTIVE, UserStatus.INACTIVE],
      [UserStatus.ACTIVE]: [UserStatus.INACTIVE],
      [UserStatus.INACTIVE]: [UserStatus.ACTIVE],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Valid transitions from ${currentStatus} are: ${validTransitions[currentStatus].join(', ')}`,
      );
    }
  }

  // New methods using custom repository functionality
  async findUsersByDateRange(startDate: Date, endDate: Date): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findUsersByDateRange(startDate, endDate);
    return users.map(user => this.transformToResponse(user));
  }

  async findUsersByEmailPattern(pattern: string): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findUsersByEmailPattern(pattern);
    return users.map(user => this.transformToResponse(user));
  }

  async getUsersCountByMonth() {
    return this.usersRepository.getUsersCountByMonth();
  }

  async findUsersWithDetails(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findUsersWithDetails();
    return users.map(user => this.transformToResponse(user));
  }

  async bulkCreate(createUserDtos: CreateUserDto[]): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.bulkCreate(createUserDtos);
    return users.map(user => this.transformToResponse(user));
  }
} 