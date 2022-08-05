import { Body, Controller, Post } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDto): Promise<any> {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto): Promise<UserEntity> {
    return this.authService.signup(signupDto);
  }
}
