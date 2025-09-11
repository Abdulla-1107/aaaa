import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFraudsterDto } from './dto/create-fraudster.dto';
import { UpdateFraudsterDto } from './dto/update-fraudster.dto';
import { FraudsterQueryDto } from './dto/query';

@Injectable()
export class FraudsterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFraudsterDto: CreateFraudsterDto, userId: string) {
    // Passport mavjudligini tekshirish
    const passport = await this.prisma.passport.findFirst({
      where: { id: createFraudsterDto.passportId },
    });

    if (!passport) {
      throw new Error(`Passport topilmadi: ${createFraudsterDto.passportId}`);
    }

    // Fraudster yaratish
    return this.prisma.fraudster.create({
      data: {
        name: createFraudsterDto.name,
        surname: createFraudsterDto.surname,
        image: createFraudsterDto.image,
        passportId: createFraudsterDto.passportId, // faqat passportId
        passportCode: createFraudsterDto.passportCode,
        location: createFraudsterDto.location,
        description: createFraudsterDto.description,
        userId, // bu yerda token orqali keladi
      },
      include: {
        passport: true, // passportni join qilib ko‘rsatadi
      },
    });
  }

  async findAll(query: FraudsterQueryDto) {
    try {
      let { search, passportCode, location, page = 1, limit = 10 } = query;

      // Xavfsizlik uchun type tekshiruvlar
      page = Number(page) > 0 ? Number(page) : 1;
      limit = Number(limit) > 0 ? Number(limit) : 10;

      const fraudsters = await this.prisma.fraudster.findMany({
        where: {
          AND: [
            search
              ? {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { surname: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {},
            passportCode ? { passportCode: { contains: passportCode } } : {},
            location
              ? { location: { contains: location, mode: 'insensitive' } }
              : {},
          ],
        },
        include: {
          passport: true,
          user: { select: { id: true, name: true, username: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.fraudster.count({
        where: {
          AND: [
            search
              ? {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { surname: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {},
            passportCode ? { passportCode: { contains: passportCode } } : {},
            location
              ? { location: { contains: location, mode: 'insensitive' } }
              : {},
          ],
        },
      });

      return {
        data: fraudsters,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('findAll error:', error);
      throw new Error('Fraudsterlarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: string) {
    const fraudster = await this.prisma.fraudster.findFirst({
      where: { id },
      include: { passport: true, user: { select: { name: true } } },
    });

    if (!fraudster) {
      throw new NotFoundException(`Fraudster with id ${id} not found`);
    }
    return fraudster;
  }

  async update(
    id: string,
    updateFraudsterDto: UpdateFraudsterDto,
    userId: string,
  ) {
    const fraudster = await this.prisma.fraudster.findFirst({ where: { id } });
    if (!fraudster) {
      throw new NotFoundException('Fraudster topilmadi');
    }
    if (userId != fraudster.userId) {
      throw new ForbiddenException(
        "Siz o'zingiz qo'shgan firibgarni o'zgartira olasiz",
      );
    }
    return this.prisma.fraudster.update({
      where: { id },
      data: updateFraudsterDto,
      include: { passport: true },
    });
  }

  async remove(id: string, userId: string) {
    const fraudster = await this.prisma.fraudster.findFirst({ where: { id } });
    if (!fraudster) {
      throw new NotFoundException('Fraudster topilmadi');
    }
    if (userId != fraudster.userId) {
      throw new ForbiddenException(
        "Siz o'zingiz qo'shgan firibgarni o'chira olasiz",
      );
    }
    return this.prisma.fraudster.delete({
      where: { id },
    });
  }

  // 🔹 Jami fraudsterlar soni
  async countAll(): Promise<{ count: number }> {
    const count = await this.prisma.fraudster.count();
    return { count };
  }

  // 🔹 Foydalanuvchi qo‘shganlari soni
  async countByUser(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.fraudster.count({
      where: { userId },
    });
    return { count };
  }

  // 🔹 Bugun qo‘shilganlari soni
  async countToday(): Promise<{ count: number }> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await this.prisma.fraudster.count({
      where: { createdAt: { gte: startOfDay } },
    });
    return { count };
  }

  // 🔹 Bugun qo‘shilganlari RO‘YXATI
  async findToday(): Promise<any[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return this.prisma.fraudster.findMany({
      where: { createdAt: { gte: startOfDay } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔹 Foydalanuvchi qo‘shganlari RO‘YXATI
  async findByUser(userId: string): Promise<any[]> {
    return this.prisma.fraudster.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
