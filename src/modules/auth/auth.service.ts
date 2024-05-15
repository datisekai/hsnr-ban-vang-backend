import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { GoogleAuthService } from './google-auth.service';
import { removeVietnameseDiacritics } from 'src/common/helpers';
import { AppRoles } from 'src/app.role';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });

    if (user && user.password && (await compare(pass, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  login(user: User) {
    const { _id, ...rest } = user;
    const payload = { sub: _id };

    delete user['password'];

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async loginGoogle(idToken: string) {
    const googleUserInfo = await this.googleAuthService.verifyIdToken(idToken);

    if (!googleUserInfo) {
      throw new BadRequestException('Invalid id token');
    }

    const userExist = await this.userService.findOne({
      email: googleUserInfo.email,
    });

    if (!userExist) {
      const createdUser = await this.userService.create({
        email: googleUserInfo.email,
        roles: [AppRoles.FREE],
        fullname: googleUserInfo.name,
        is_active: true,
        password: '',
      });

      return this.login(createdUser);
    }

    return this.login(userExist);
  }
}
