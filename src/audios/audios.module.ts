import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudiosController } from './audios.controller';
import { AudiosService } from './audios.service';
import { Audio } from './entities/audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audio])],
  controllers: [AudiosController],
  providers: [AudiosService],
})
export class AudiosModule {}
