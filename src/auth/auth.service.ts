import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signin(signinDto: SigninDto) {
    const user = await this.usersService.findByEmail(signinDto.email);

    if (!user) {
      throw new BadRequestException('wrong email or password');
    }

    const isValidPassword = await bcrypt.compare(
      signinDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('wrong email or password');
    }

    const token = jsonwebtoken.sign(
      { email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '5m',
      },
    );

    return { accessToken: token };
  }

  async signup(signupDto: SignupDto): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(signupDto.email);

    if (user) {
      throw new BadRequestException('user with this email already exists');
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(signupDto.password, salt);

    return this.usersService.create({ ...signupDto, password: hashedPassword });
  }
}
