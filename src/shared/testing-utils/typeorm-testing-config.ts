import { TypeOrmModule } from "@nestjs/typeorm";
import { AerolineaEntity } from "../../aerolinea/aerolinea.entity";
import { AeropuertoEntity } from "../../aeropuerto/aeropuerto.entity";


export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [AeropuertoEntity, AerolineaEntity],
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity]),
   ];