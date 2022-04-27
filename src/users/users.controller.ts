import { AuthGuard } from './../guards/auth.guard';
import { UserEntity } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() createUser: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      createUser.email,
      createUser.password,
    );

    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() signinUser: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(
      signinUser.email,
      signinUser.password,
    );
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.findEmail(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(parseInt(id), updateUser);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
