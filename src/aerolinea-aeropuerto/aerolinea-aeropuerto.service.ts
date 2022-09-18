import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaAeropuertoService {

    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) {}

    async addAeropuertoAerolinea(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]})
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id proporcionado no existe", BusinessError.NOT_FOUND);
       
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]}); 
        if (!aerolinea)
          throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND);
     
        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
      }

      async findAeropuertoByAerolineaIdAeropuertoId(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id proporcionado no existe", BusinessError.NOT_FOUND)
        
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]}); 
        if (!aerolinea)
          throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND)
    
        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
    
        if (!aerolineaAeropuerto)
          throw new BusinessLogicException("El aeropuerto con el id proporcionado no existe", BusinessError.PRECONDITION_FAILED)
    
        return aerolineaAeropuerto;
    }

    async findAeropuertosByAerolineaId(aerolineaId: string): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND)
        
        return aerolinea.aeropuertos;
    }
 
    async associateAeropuertosAerolinea(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
    
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < aeropuertos.length; i++) {
            const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertos[i].id}, relations: ["aerolineas"]});
            if (!aeropuerto)
                throw new BusinessLogicException("El aeropuerto con el id proporcionado no existe", BusinessError.NOT_FOUND)
        }
 
        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
    }

    async deleteAeropuertoAerolinea(aerolineaId: string, aeropuertoId: string){
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no existe", BusinessError.NOT_FOUND)
 
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no existe", BusinessError.NOT_FOUND)
 
        const aerolineaAeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
 
        if (!aerolineaAeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no existe", BusinessError.PRECONDITION_FAILED)

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== aeropuertoId);
        await this.aerolineaRepository.save(aerolinea);
    }   
}