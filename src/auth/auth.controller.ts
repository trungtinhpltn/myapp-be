import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { Public } from './decorators/public.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthUserDto, TokenResponse } from './dto/token-response.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { AuthUser } from './types.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: TokenResponse })
  @ApiUnauthorizedResponse({
    description: 'Username or password is invalid!',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is invalid!',
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.handleRefreshToken(dto.refreshToken);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiOperation({
    summary: 'Logout delete refresh token',
  })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiNoContentResponse()
  @ApiOperation({
    summary: 'Logout all device',
  })
  logoutAll(@CurrentUser() user: AuthUser) {
    return this.authService.logoutAll(user.id);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: AuthUserDto })
  getme(@CurrentUser() user: AuthUser) {
    return user;
  }
}
