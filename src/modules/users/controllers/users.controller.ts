import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: [UserResponseDto],
  })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({
    status: 200,
    description: 'Return all active users.',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  findActiveUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findActiveUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiResponse({
    status: 200,
    description: 'The user status has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Invalid status value.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateStatus(+id, updateUserStatusDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
} 