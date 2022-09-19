import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AeropuertoDto } from '../aeropuerto/aeropuerto.dto';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {
    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}

    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.addAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAeropuertoByAerolineaIdAeropuertoId(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.findAeropuertoByAerolineaIdAeropuertoId(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos')
    async findAeropuertosByAerolineaId(@Param('aerolineaId') aerolineaId: string): Promise<any>{
        return await this.aerolineaAeropuertoService.findAeropuertosByAerolineaId(aerolineaId);
    }

    @Put(':aerolineaId/aeropuertos')
    async associateAeropuertosAerolinea(@Body() aeropuertosDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string){
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto)
        return await this.aerolineaAeropuertoService.associateAeropuertosAerolinea(aerolineaId, aeropuertos);
    }
    
    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAeropuertoAerolinea(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.deleteAeropuertoAerolinea(aerolineaId, aeropuertoId);
    }
}
