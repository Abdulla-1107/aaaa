import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNasiyaDto } from './dto/create-nasiya.dto';
import { UpdateNasiyaDto } from './dto/update-nasiya.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NasiyaStatus } from 'src/enums/nasiya';
import { NasiyaQueryDto } from './dto/query-dto';
import { GetMyNasiyaDto } from './dto/dto';

@Injectable()
export class NasiyaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNasiyaDto: CreateNasiyaDto, userId: string) {
    const passport = await this.prisma.passport.findFirst({
      where: { id: createNasiyaDto.passportId },
    });
    if (!passport) {
      throw new NotFoundException('passport topilmadi Id si');
    }
    const data = await this.prisma.nasiya.findFirst({
      where: {
        passportCode: createNasiyaDto.passportCode,
        passportId: createNasiyaDto.passportId,
      },
    });
    if (data) {
      throw new ForbiddenException(
        'Ushbu foydalanuvchi nasiya savdodan foydalanmoqda !',
      );
    }
    return this.prisma.nasiya.create({
      data: {
        name: createNasiyaDto.name,
        surname: createNasiyaDto.surname,
        phoneNumber: createNasiyaDto.phoneNumber,
        phoneImei: createNasiyaDto.phoneImei,
        productName: createNasiyaDto.productName,
        passportId: createNasiyaDto.passportId,
        passportCode: createNasiyaDto.passportCode,
        userImage: createNasiyaDto.userImage,
        productImage: createNasiyaDto.productImage,
        time: createNasiyaDto.time.toString(),
        status: NasiyaStatus.PENDING,
        downPayment: createNasiyaDto.downPayment,
        monthlyPayment: createNasiyaDto.monthlyPayment,
        userId,
      },
    });
  }

  async findAll(query: NasiyaQueryDto) {
    const {
      page = 1,
      limit = 10,
      name,
      productName,
      status,
      sort = 'desc',
    } = query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (productName)
      where.productName = { contains: productName, mode: 'insensitive' };
    if (status) where.status = status;

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.nasiya.findMany({
          where,
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          orderBy: { createdAt: sort },
        }),
        this.prisma.nasiya.count({ where }),
      ]);

      return {
        data,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      };
    } catch (error) {
      console.error('Nasiya findAll error:', error);
      throw new Error('Nasiya yozuvlarini olishda xatolik yuz berdi');
    }
  }

  async findOne(id: string) {
    const data = await this.prisma.nasiya.findFirst({
      where: { id },
      include: {
        Passport: true,
        User: { select: { name: true, username: true } },
      },
    });
    if (!data) {
      throw new NotFoundException('Data topilmadi');
    }
    return data;
  }

  update(id: string, updateNasiyaDto: UpdateNasiyaDto) {
    return `This action updates a #${id} nasiya`;
  }

  async remove(id: string, userId: string) {
    const data = await this.prisma.nasiya.delete({ where: { id } });
    if (!data) {
      throw new NotFoundException('Data topilmadi');
    }

    if (userId != data.userId) {
      throw new ForbiddenException(
        "Siz o'zizga tegishli mijozni o'chira olasiz",
      );
    }
    return data;
  }

  async findMy(userId: string, query: GetMyNasiyaDto) {
    try {
      console.log('User ID:', userId);

      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const skip = (page - 1) * limit;

      const where: any = { userId };

      if (query.search) {
        where.name = { contains: query.search, mode: 'insensitive' };
      }

      const [data, total] = await this.prisma.$transaction([
        this.prisma.nasiya.findMany({
          where,
          skip: skip >= 0 ? skip : 0,
          take: limit > 0 ? limit : 10,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.nasiya.count({ where }),
      ]);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('findMy error:', error);
      throw new Error(
        'Userga tegishli nasiya yozuvlarini olishda xatolik yuz berdi',
      );
    }
  }
}
