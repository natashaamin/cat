import * as t from "io-ts";

export interface Weight {
  imperial: string;
  metric: string;
}

export interface Breed {
  id: string;
  name: string;
  life_span: string;
  weight: Weight;
}

export const TGetCatImage = t.interface({
  breed: t.array(t.type({
    id: t.string,
    name: t.string,
    life_span: t.string,
    weight: t.type({
      imperial: t.string,
      metric: t.string,
    }),  
  })),
  id: t.string,
  url: t.string,
  height: t.number,
  width: t.number
});

export type GetCatImageResponse = t.TypeOf<typeof TGetCatImage>;

export interface GetCatImageRequest {}
