import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFraudsterDto } from './dto/create-fraudster.dto';
import { UpdateFraudsterDto } from './dto/update-fraudster.dto';
import { FraudsterQueryDto } from './dto/query';
import { SearchQueryDto } from './dto/Search';

@Injectable()
export class FraudsterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFraudsterDto: CreateFraudsterDto, userId: string) {
    const { name, surname, passportSeriya, passportCode, type } =
      createFraudsterDto;

    const check = await this.prisma.fraudster.findFirst({
      where: { passportCode: createFraudsterDto.passportCode },
    });

    if (check) {
      throw new BadRequestException(
        "Ushbu passportga tegishli ma'lumot yaratilgan",
      );
    }

    const fraudster = await this.prisma.fraudster.create({
      data: {
        name,
        surname,
        passportSeriya,
        passportCode,
        type,
        userId,
      },
    });

    return {
      message: 'Muvaffaqiyatli qo‘shildi ✅',
      data: fraudster,
    };
  }

  async findAll(query: FraudsterQueryDto) {
    try {
      let { search, passportCode, page = 1, limit = 10 } = query;

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
          ],
        },
        include: {
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
      include: { user: true },
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
  async countByUser(userId: string): Promise<{ count: number; data: any[] }> {
    const [count, data] = await Promise.all([
      this.prisma.fraudster.count({
        where: { userId },
      }),

      this.prisma.fraudster.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          surname: true,
          passportCode: true,
          passportSeriya: true,
          type: true,
          createdAt: true,
          // kerak bo‘lsa boshqa maydonlarni ham yozing
        },
        orderBy: { createdAt: 'desc' }, // eng oxirgi qo‘shilganlari yuqorida
      }),
    ]);

    return { count, data };
  }

  async getSearchData(query: SearchQueryDto) {
    const { passportSeriya, passportCode } = query;

    return await this.prisma.fraudster.findMany({
      where: {
        passportSeriya,
        passportCode,
      },
    });
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
