import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  // Basic CRUD operations
  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  // Custom complex queries
  async findUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    return this.repository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findUsersByEmailPattern(pattern: string): Promise<User[]> {
    return this.repository.find({
      where: {
        email: Like(`%${pattern}%`),
      },
    });
  }

  // Aggregation queries
  async getUsersCountByMonth(): Promise<{ month: string; count: number }[]> {
    return this.repository
      .createQueryBuilder('user')
      .select('DATE_TRUNC(\'month\', created_at) as month')
      .addSelect('COUNT(*) as count')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .getRawMany();
  }

  // Complex joins and relations
  async findUsersWithDetails(): Promise<User[]> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .orderBy('user.created_at', 'DESC')
      .getMany();
  }

  // Batch operations
  async bulkCreate(users: Partial<User>[]): Promise<User[]> {
    const newUsers = users.map(user => this.repository.create(user));
    return this.repository.save(newUsers);
  }

  // Custom update with conditions
  async updateUserStatus(id: number, status: UserStatus): Promise<User> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  // Caching example
  async findUserWithCache(id: number): Promise<User> {
    return this.repository.findOne({
      where: { id },
      cache: {
        id: `user_${id}`,
        milliseconds: 60000, // Cache for 1 minute
      },
    });
  }
} 