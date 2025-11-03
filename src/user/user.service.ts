import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { name, username, password, phone, role } = createUserDto;

    // Username unikal bo‘lishi kerak
    const existUsername = await this.prisma.user.findFirst({
      where: { username },
    });
    if (existUsername) {
      throw new BadRequestException('Bunday username allaqachon mavjud');
    }

    // Phone unikal bo‘lishi kerak
    const existPhone = await this.prisma.user.findFirst({
      where: { phone },
    });
    if (existPhone) {
      throw new BadRequestException('Bunday telefon raqam allaqachon mavjud');
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    // User yaratish
    const user = await this.prisma.user.create({
      data: {
        name,
        username,
        phone,
        password: hashedPassword,
        role: role ?? 'user', // agar role yuborilmasa, default "user"
      },
    });

    // Parolni qaytarmaymiz
    const { password: _, ...result } = user;
    return { result };
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    // User qidirish
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Bunday foydalanuvchi mavjud emas');
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Parol noto‘g‘ri');
    }

    // Token yaratish
    const payload = { sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    // Parolni qaytarmaymiz
    const { password: _, ...result } = user;

    return {
      token,
    };
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: { Fraudster: true },
    });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
    let deleteUser = await this.prisma.user.delete({ where: { id } });
    return deleteUser;
  }

  async me(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    return { data: user };
  }
}
