import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import { GetCatBreedResponse } from "./models/breed";
import * as SearchServices from "../src/api/SearchServices";
import { ApiErrorHandler } from "./utilities/ApiErrorHandler";
import SearchComponent from "./containers/SearchComponent";
import ListItemComponent from "./containers/ListItemComponent";
import { GetCatImageResponse } from "./models/image";
import { debounce } from "lodash";
import _ from "lodash";

interface StyleSheet {
  [key: string]: React.CSSProperties;
}

interface Weight {
  imperial: string;
  metric: string;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<GetCatImageResponse[]>([]);


  const getCatDetails = async (
    breedName: string,
    cb: (res: GetCatImageResponse[]) => any
  ) => {
    try {
      setLoading(true);
      await SearchServices.getCatBreed(breedName)
        .then((body) => {
          return body.json();
        })
        .then((breeds) => {
          const final = breeds.map(
            (breed: {
              name: string;
              id: string;
              life_span: string;
              weight: Weight;
            }) =>
              SearchServices.getCatImage(breed.id)
                .then((resp) => resp.json())
                .then((res) => {
                  if(res.length == 0) return;
                  return ({
                    name: breed.name,
                    url: res[0].url,
                    weight: breed.weight,
                    life_span: breed.life_span,
                  })
                })
          );
          cb(final);
        });
    } catch (e) {
      ApiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData: any = useCallback(
    debounce((query: string, cb) => {
      getCatDetails(query, cb);
    }, 1000),
    []
  );

  const styles: StyleSheet = {
    emptyDiv: {
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    list: {
      display: "contents",
    },
  };

  useEffect(() => {
    if (query.length >= 3) {
      const parsedQuery = query.replace(" ", "+");
      debouncedFetchData(parsedQuery, (res: GetCatImageResponse[]) => {
        Promise.all(res).then((body) => {
          const final = body.filter(x => x != undefined);
          final.length == 0 ? setIsEmpty(true): setIsEmpty(false);
          setState(final);
        });
      });
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [query]);

  return (
    <div>
      <SearchComponent
        value={query}
        onChangeText={(e) => {
          setQuery(e.target.value);
        }}
      />

      {!isEmpty ? (
        state.map((result, index) => (
          <div key={index} style={styles.list}>
            <ListItemComponent
              name={result.name}
              weight={result.weight.imperial}
              lifeSpan={result.life_span}
              imgUrl={result.url}
              loading={loading}
            />
          </div>
        ))
      ) : (
        <div>
          {" "}
          <p style={styles.emptyDiv}>No search found</p>
        </div>
      )}
    </div>
  );
}

export default App;
