import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.lorem.text(),
        pais: faker.lorem.text(),
        ciudad: faker.lorem.text()})
        aeropuertosList.push(aeropuerto);   
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne should return a aeropuerto by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertosList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo)
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais)
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad)
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no existe")
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.company.name(),
      codigo: faker.lorem.text(),
      pais: faker.lorem.text(),
      ciudad: faker.lorem.text(),
      aerolineas: []
    }
 
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();
 
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo)
    expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais)
    expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad)
  });

  it('update should modify a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto.nombre = "Nuevo nombre";
    aeropuerto.codigo = "Nuevo codigo";
     const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
     const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(aeropuerto.codigo)
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "Nuevo nombre", codigo: "Nuevo código"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no existe")
  });

  it('delete should remove a aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.delete(aeropuerto.id);
     const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.delete(aeropuerto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El aeropuerto con el id proporcionado no existe")
  });

});
