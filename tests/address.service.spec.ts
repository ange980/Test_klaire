import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../src/address/address.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from '../src/address/address.entity';
import { of } from 'rxjs';

describe('AddressService', () => {
  let service: AddressService;
  let httpService: Partial<HttpService>;
  let repo: any;

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    };

    repo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: HttpService, useValue: httpService },
        { provide: getRepositoryToken(Address), useValue: repo },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('devrait créer et sauvegarder une adresse si un résultat est trouvé', async () => {
    const fakeResult = {
      data: {
        features: [
          {
            properties: {
              label: '8 bd du port 75001 Paris',
              housenumber: '8',
              street: 'bd du port',
              postcode: '75001',
              citycode: '12345',
            },
            geometry: {
              coordinates: [2.35, 48.85],
            },
          },
        ],
      },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(fakeResult));
    repo.create.mockReturnValue({ ...fakeResult.data.features[0].properties });
    repo.save.mockResolvedValue({ id: 1, ...fakeResult.data.features[0].properties });

    const result = await service.createAddress('8 bd du port');

    expect(httpService.get).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 1);
  });

  it('devrait lever une erreur si aucun résultat trouvé', async () => {
    const fakeResult = { data: { features: [] } };
    (httpService.get as jest.Mock).mockReturnValue(of(fakeResult));

    await expect(service.createAddress('adresse-invalide')).rejects.toThrow(expect.objectContaining({
      status: 404
    }));
  });
});
