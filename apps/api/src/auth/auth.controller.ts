import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return { message: 'signup endpoint contract ready', email: dto.email, nickname: dto.nickname };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return { message: 'login endpoint contract ready', email: dto.email };
  }

  @Post('logout')
  logout() {
    return { message: 'logout endpoint contract ready' };
  }

  @Post('refresh')
  refresh() {
    return { message: 'refresh endpoint contract ready' };
  }

  @Get('me')
  me() {
    return { message: 'me endpoint contract ready' };
  }
}
