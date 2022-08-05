import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(signupDto: SignupDto) {
    const user = this.usersService.findByEmail(signupDto.email);

    if (user) {
      throw new BadRequestException('user with this email already exists');
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(signupDto.password, salt);

    this.usersService.create({ ...signupDto, password: hashedPassword });
  }
}
