import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import { GetCatBreedResponse } from "./models/breed";
import * as SearchServices from "../src/api/SearchServices";
import { ApiErrorHandler } from "./utilities/ApiErrorHandler";
import debounce from "lodash/debounce";
import SearchComponent from "./containers/SearchComponent";
import ListItemComponent from "./containers/ListItemComponent";
import { GetCatImageResponse } from "./models/image";

interface StyleSheet {
  [key: string]: React.CSSProperties;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const [query, setQuery] = useState("");
  const [imageResults, setImageResults] = useState<GetCatImageResponse[]>([]);

  const getCatDetails = async (
    breedName: string,
    cb: (value: GetCatImageResponse[]) => void
  ) => {
    try {
      setLoading(true);
      const responseResult = await SearchServices.getCatBreed(breedName);
      const breedResult = (await responseResult
        .json()
        .then((body) => body)) as GetCatBreedResponse[];

      if(breedResult.length == 0) setIsEmpty(true);

      breedResult.map(async (x) => {
        try {
          await getCatImages(x.id).then((body) => {
            if (body == undefined) return;
            cb(body);
          });
        } catch (e) {
          ApiErrorHandler(e);
        }
      });
    } catch (e) {
      ApiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const getCatImages = async (id: string) => {
    try {
      const res = await SearchServices.getCatImage(id);
      const final = (await res
        .json()
        .then((body) => body)) as GetCatImageResponse[];
      return final;
    } catch (e) {
      ApiErrorHandler(e);
    }
  };

  const debouncedFetchData = useCallback(
    debounce((query, cb) => {
      getCatDetails(query, cb);
    }, 1000),
    []
  );

  const styles: StyleSheet = {
    emptyDiv: {
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  }

  useEffect(() => {
    if (query.length >= 3) {
      debouncedFetchData(query, (res: []) => {
        setImageResults(res);
        return () => {
          debouncedFetchData.cancel();
        };
      });
    }
  }, [query]);

  return (
    <div>
      <SearchComponent
        value={query}
        onChangeText={(e) => {
          setQuery(e.target.value);
        }}
      />

      {isEmpty && <div> <p style={styles.emptyDiv}>No search found</p></div>}

      <div>
        {imageResults.map((items, index) => {
          return (
            <div key={index}>
              {items.breeds
                .sort((a, b) =>
                  a.name > b.weight.imperial && a.weight.imperial > b.life_span
                    ? 1
                    : -1
                )
                .map((subItems) => {
                  return (
                    <ListItemComponent
                      name={subItems.name}
                      weight={subItems.weight.imperial}
                      lifeSpan={subItems.life_span}
                      imgUrl={items.url}
                      loading={loading}
                    />
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;


