import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'user profile endpoint contract ready' };
  }

  @Patch('me')
  updateMe(@Body() body: { nickname?: string; bio?: string; preferredGenres?: string[] }) {
    return { message: 'update profile endpoint contract ready', profile: body };
  }

  @Post('me/profile-image')
  uploadProfileImage() {
    return { message: 'profile image upload endpoint contract ready' };
  }
}
