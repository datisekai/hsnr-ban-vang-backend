import { Controller, Post, Get, UseGuards, Body, Query } from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { User, Auth } from 'src/common/decorators';
import { User as UserEntity } from 'src/modules/user/user.entity';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { GoogleAuthService } from './google-auth.service';

@ApiTags('Auth routes')
@Controller('api.auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
  })
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    const data = await this.authService.login(user);
    return {
      message: 'Login successfully',
      data,
    };
  }

  @Auth()
  @Get('profile')
  @ApiOperation({
    summary: 'Get My Profile',
  })
  profile(@User() user: UserEntity) {
    return {
      message: 'Get Profile successfully',
      user,
    };
  }

  @Get('google-login')
  @ApiOperation({
    summary: 'Login google',
  })
  async googleLogin(@Query() query) {
    if (!query.idToken) {
      return {
        message: 'idToken is required',
      };
    }

    const data = await this.authService.loginGoogle(query.idToken);
    return {
      message: 'Login successfully',
      data,
    };
  }

  @Auth()
  @Post('check-token')
  async checkToken(@User() user: UserEntity) {
    return { data: true };
  }

  // @Auth()
  // @Get('refresh')
  // @ApiOperation({
  //   summary: 'Refresh token',
  // })
  // refreshToken(@User() user: UserEntity) {
  //   const data = this.authService.login(user);
  //   return {
  //     message: 'Refresh successfully',
  //     data,
  //   };
  // }
}
