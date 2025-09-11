import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FraudsterService } from './fraudster.service';
import { CreateFraudsterDto } from './dto/create-fraudster.dto';
import { UpdateFraudsterDto } from './dto/update-fraudster.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FraudsterQueryDto } from './dto/query';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth('access-token')
@ApiTags('Fraudster')
@Controller('fraudster')
export class FraudsterController {
  constructor(private readonly fraudsterService: FraudsterService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Yangi firibgar qo‘shish' })
  create(@Req() req: Request, @Body() createFraudsterDto: CreateFraudsterDto) {
    console.log(req['user'].sub);
    const userId = req['user'].sub;
    if (!userId) {
      throw new UnauthorizedException('User ID topilmadi');
    }
    return this.fraudsterService.create(createFraudsterDto, userId);
  }

  @Get()
  @ApiOperation({
    summary:
      'Barcha firibgarlarni olish (passport seriyasi, qidiruv, filter va pagination bilan)',
  })
  findAll(@Query() query: FraudsterQueryDto) {
    return this.fraudsterService.findAll(query);
  }

  // 🔹 Jami fraudsterlar soni
  @Get('count')
  @ApiOperation({ summary: 'Jami firibgarlar soni' })
  async getCount() {
    return this.fraudsterService.countAll();
  }

  // 🔹 Token orqali kelgan user qo‘shganlari
  @Get('my-count')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Foydalanuvchining firibgarlari soni' })
  async getMyCount(@Req() req: any) {
    const userId = req['user'].sub;
    return this.fraudsterService.countByUser(userId);
  }

  // 🔹 Bugun qo‘shilgan fraudsterlar soni
  @Get('today-count')
  @ApiOperation({ summary: 'Bugun qo‘shilgan firibgarlar soni' })
  async getTodayCount() {
    return this.fraudsterService.countToday();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'ID bo‘yicha firibgarni olish (passport seriyasi bilan)',
  })
  findOne(@Param('id') id: string) {
    return this.fraudsterService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Firibgar ma’lumotlarini yangilash' })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateFraudsterDto: UpdateFraudsterDto,
  ) {
    const userId = req['user'].sub;
    return this.fraudsterService.update(id, updateFraudsterDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Firibgarni o‘chirish' })
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].sub;
    return this.fraudsterService.remove(id, userId);
  }
}
