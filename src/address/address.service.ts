import { Injectable, HttpException, HttpStatus,NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';  // Pour convertir l'Observable en Promise
import { Address } from './address.entity';

@Injectable()
export class AddressService {
  constructor(
    private readonly httpService: HttpService,  
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createAddress(query: string): Promise<Address> {
    try {

      // Valider que query est présent et non vide
      if (!query || typeof query !== 'string' || query.trim() === '') {
        throw new HttpException(
          { error: "Le champ 'q' est requis et doit être une chaîne non vide." },
          HttpStatus.BAD_REQUEST,
        );
      }
  
      //Appel à l'API Adresse (BAN)
      const response = await firstValueFrom(
        this.httpService.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`)
      );
  
      const result = response.data?.features?.[0];
  
      // Aucun résultat => 404
      if (!result) {
        throw new HttpException('',HttpStatus.NOT_FOUND);
      }
  
      //Création de l'entité à partir du résultat
      const address = this.addressRepository.create({
        label: result.properties.label,
        housenumber: result.properties.housenumber,
        street: result.properties.street,
        postcode: result.properties.postcode,
        citycode: result.properties.citycode,
        latitude: result.geometry.coordinates[1],
        longitude: result.geometry.coordinates[0],
      });
  
      //  DB SQLite
      const savedAddress = await this.addressRepository.save(address);
  
      //Retourner l'objet persisté
      return savedAddress;
  
    } catch (error) {
      //  HttpException (400, 404), on relance tel quel
      if (error instanceof HttpException) {
        throw error;
      }
  
      // erreur serveur
      throw new HttpException(
        {
          error: "Erreur serveur : impossible de contacter l'API externe.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async getRisks(id: number): Promise<any> {
    try {
      // 1. Chercher l'adresse en base avec l'id
      const address = await this.addressRepository.findOneBy({id});
      if (!address) {
        // 2. Adresse non trouvée, on renvoie une erreur 404
        throw new NotFoundException('Adresse non trouvée.');
      }

      // 3. Appel à l'API Géorisques avec latitude et longitude
      const response = await firstValueFrom(
        this.httpService.get(
          `https://www.georisques.gouv.fr/api/v1/resultats_rapport_risque?latlon=${address.longitude},${address.latitude}`,
        ),
      );

      // 4. Retourner la réponse complète de l'API Géorisques (JSON)
      return response.data;

    } catch (error) {
      // 5. Gestion des erreurs : échec de l'appel à l'API ou erreur interne
      if (error.response) {
        // Si l'API Géorisques renvoie une erreur spécifique
        throw new InternalServerErrorException('Erreur serveur : échec de la récupération des données de Géorisques.');
      } else if (error instanceof NotFoundException) {
        // Si l'adresse n'est pas trouvée
        throw error;
      } else {
        // Autres erreurs non liées aux réponses externes
        throw new HttpException('Erreur inconnue.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  async getAdd(): Promise<Address[]> {
    return this.addressRepository.find();
  }
}
