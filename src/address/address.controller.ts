import { Controller, Get,Post,Query, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './address.entity';

@Controller('api/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
   getAdd(): Promise<Address[]> {
    return this.addressService.getAdd();
  }

  @Post()
   postAddress(@Query('q') query: string): Promise<Address> {
    return this.addressService.createAddress(query);
  }


  @Get(':id/risks')
   getRisks(@Param('id') id: number) {
    try {
      // Appel à la méthode du service pour obtenir les risques associés à l'adresse
      const risks =  this.addressService.getRisks(id);
      return risks;  // Retourne directement les données de Géorisques
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Si l'adresse n'est pas trouvée, renvoyer 404
        throw new NotFoundException({
          error: 'Adresse non trouvée.',
        });
      }

      // Si une autre erreur se produit (par exemple échec de l'appel API), renvoyer 500
      throw new InternalServerErrorException({
        error: 'Erreur serveur : échec de la récupération des données de Géorisques.',
      });
    }
  }


}
