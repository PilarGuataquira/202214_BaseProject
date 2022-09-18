import {IsDate, IsNotEmpty, IsString} from 'class-validator';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @IsDate()
 @IsNotEmpty()
 readonly fechafundacion: string;
 
 @IsString()
 @IsNotEmpty()
 readonly paginaweb: string;
 
}