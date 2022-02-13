import * as t from "io-ts";

export const TGetCatBreed = t.interface({
  id: t.string,
  name: t.string,
  life_span: t.string,
  weight: t.type({
    imperial: t.string,
    metric: t.string,
  }),
});

export type GetCatBreedResponse = t.TypeOf<typeof TGetCatBreed>;

export interface GetCatBreedRequest {}
