import { GetCatImageResponse } from '../models/image';
import { GetCatBreedResponse } from '../models/breed';
import * as http from './HttpHelper';

const CAT = {
  breed: 'v1/breeds/search',
  image: 'v1/images/search'
};

export const getCatBreed = async (breedName: string) => {
  const url = `${CAT.breed}?q=${breedName}`;
  return await http.get<GetCatBreedResponse>(url, true);
};

export const getCatImage = async (id: string) => {
  const url = `${CAT.image}?breed_ids=${id}`;
  return await http.get<GetCatImageResponse>(url, true);
};
