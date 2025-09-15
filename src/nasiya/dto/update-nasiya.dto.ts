import { PartialType } from '@nestjs/swagger';
import { CreateNasiyaDto } from './create-nasiya.dto';

export class UpdateNasiyaDto extends PartialType(CreateNasiyaDto) {}
