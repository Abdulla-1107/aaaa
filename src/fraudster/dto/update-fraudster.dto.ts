import { PartialType } from '@nestjs/swagger';
import { CreateFraudsterDto } from './create-fraudster.dto';

export class UpdateFraudsterDto extends PartialType(CreateFraudsterDto) {}
