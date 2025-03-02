import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@/shared/decorators/auth.decorator';

import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { ResponseDTO } from './dtos/response.dto';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns an access token',
  })
  @ApiOkResponse({ type: ResponseDTO })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDTO) {
    return await this.loginUseCase.execute(body);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description: 'Creates a new user account in the system',
  })
  @ApiOkResponse({ type: ResponseDTO })
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterDTO) {
    return await this.registerUseCase.execute(body);
  }
}
