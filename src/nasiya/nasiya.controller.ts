import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NasiyaService } from './nasiya.service';
import { CreateNasiyaDto } from './dto/create-nasiya.dto';
import { UpdateNasiyaDto } from './dto/update-nasiya.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { NasiyaQueryDto } from './dto/query-dto';
import { GetMyNasiyaDto } from './dto/dto';
import { log } from 'console';

@ApiBearerAuth('access-token')
@Controller('nasiya')
export class NasiyaController {
  constructor(private readonly nasiyaService: NasiyaService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() createNasiyaDto: CreateNasiyaDto) {
    const userId = req['user'].sub;
    if (!userId) {
      throw new UnauthorizedException('User ID topilmadi');
    }
    return this.nasiyaService.create(createNasiyaDto, userId);
  }

  @Get()
  findAll(@Query() query: NasiyaQueryDto) {
    return this.nasiyaService.findAll(query);
  }

  @Get('my')
  @UseGuards(AuthGuard)
  findMy(@Query() query: GetMyNasiyaDto, @Req() req) {
    const userId = req['user'].sub;
    console.log(userId);

    if (!userId) {
      throw new UnauthorizedException('User ID topilmadi');
    }
    return this.nasiyaService.findMy(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nasiyaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNasiyaDto: UpdateNasiyaDto) {
    return this.nasiyaService.update(id, updateNasiyaDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user'].sub;
    if (!userId) {
      throw new UnauthorizedException('User ID topilmadi');
    }
    return this.nasiyaService.remove(id, userId);
  }
}
