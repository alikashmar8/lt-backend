import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAudioDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;
    
    @ApiProperty()
    @IsNotEmpty()
    audioUrl: string;
    
    @ApiProperty()
    @IsOptional()
    audioType?: string;
    
    @ApiProperty()
    @IsOptional()
    audioSize?: string;
    
    @ApiProperty()
    @IsOptional()
    audioDuration?: string;
}
