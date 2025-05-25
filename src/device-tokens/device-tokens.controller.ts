import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeviceTokensService } from './device-tokens.service';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';

@Controller('device-tokens')
export class DeviceTokensController {
  constructor(private readonly deviceTokensService: DeviceTokensService) {}

  @Post()
  create(@Body() createDeviceTokenDto: CreateDeviceTokenDto) {
    return this.deviceTokensService.create(createDeviceTokenDto);
  }

  @Get()
  findAll() {
    return this.deviceTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceTokenDto: UpdateDeviceTokenDto) {
    return this.deviceTokensService.update(+id, updateDeviceTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceTokensService.remove(+id);
  }
}
