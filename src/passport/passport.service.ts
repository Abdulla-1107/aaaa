import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePassportDto } from './dto/create-passport.dto';
import { UpdatePassportDto } from './dto/update-passport.dto';

@Injectable()
export class PassportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPassportDto: CreatePassportDto) {
    return this.prisma.passport.create({
      data: createPassportDto,
    });
  }

  async findAll() {
    return this.prisma.passport.findMany({
      include: { Fraudsters: true }, // agar Fraudsterlarni ham ko‘rmoqchi bo‘lsang
    });
  }

  async findOne(id: string) {
    const passport = await this.prisma.passport.findUnique({
      where: { id },
      include: { Fraudsters: true },
    });

    if (!passport) {
      throw new NotFoundException(`Passport with id ${id} not found`);
    }
    return passport;
  }

  async update(id: string, updatePassportDto: UpdatePassportDto) {
    return this.prisma.passport.update({
      where: { id },
      data: updatePassportDto,
    });
  }

  async remove(id: string) {
    return this.prisma.passport.delete({
      where: { id },
    });
  }
}
