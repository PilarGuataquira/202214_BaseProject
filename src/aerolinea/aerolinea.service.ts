import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AerolineaEntity } from './aerolinea.entity';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] } );
        if (!aerolinea)
          throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND);
   
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!persistedAerolinea)
          throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND);
        
        return await this.aerolineaRepository.save({...persistedAerolinea, ...aerolinea});
    }

}
