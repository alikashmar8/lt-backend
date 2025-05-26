import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AudiosService } from './audios.service';
import { AudioQueryParamsDto } from './dto/audio-query-params.dto';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';

@Controller('audios')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @Post()
  create(@Body() createAudioDto: CreateAudioDto) {
    return this.audiosService.create(createAudioDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() queryParams: AudioQueryParamsDto) {
    return await this.audiosService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.audiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAudioDto: UpdateAudioDto) {
    return this.audiosService.update(+id, updateAudioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.audiosService.remove(+id);
  }
}
