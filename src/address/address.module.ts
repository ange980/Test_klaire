import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  // Ajoute cette ligne
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from './address.entity';  // Si tu utilises TypeORM

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]), 
    HttpModule,  // Assure-toi que le HttpModule est importé // Assure-toi que ton module TypeORM est configuré correctement
  ],
  controllers: [AddressController],
  providers: [AddressService],  // Injections dans ton service
})
export class AddressModule {}
