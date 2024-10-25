import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { loginData } from './dto/login.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository, 
    private readonly jwtService: JwtService
  ) {}

  async logIn(signInDto: loginData): Promise<{ access_token: string, user: object }> {
    const user = await this.userRepository.findOneByEmail(signInDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;

    const payload = { sub: user._id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }
}
