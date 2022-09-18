import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AerolineaEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 descripcion: string;
 
 @Column()
 fechafundacion: Date;
 
 @Column()
 paginaweb: string;
 
 @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
 @JoinTable()
   aeropuertos: AeropuertoEntity[];

}

