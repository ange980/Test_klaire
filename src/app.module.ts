import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { Address } from './address/address.entity';
import { HttpModule } from '@nestjs/axios';  // Assurer l'import du HttpModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '/app/data/database.sqlite',  // Assure-toi que le chemin de la DB est correct
      entities: [Address],
      synchronize: true,  // À utiliser seulement en développement
    }),
    HttpModule,  // Import du module HTTP
    AddressModule,  // Import du module contenant les services d'adresse
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
