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

interface IImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  // const [img, setImg] = useState<IImage[]>([]);
  const [state, setState] = useState<GetCatImageResponse[]>([]);

  // const debounce = (func: any, delay: number) => {
  //   let setTimoutInstance: any;
  //   return function () {
  //     const args = arguments;
  //     if (setTimoutInstance) clearTimeout(setTimoutInstance);
  //     setTimoutInstance = setTimeout(() => func.apply("", args), delay);
  //   };
  // };

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
        .then((data) => {
          if (data.length == 0) setIsEmpty(true);

          data.map((x: { id: string }) => {
            getCatImages(x.id).then((body) => {
              if (body == undefined) return;
              cb(body);
            });
          });
        });
    } catch (e) {
      ApiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const getCatImages = async (id: string) => {
    console.log("getImages");
    try {
      const res = await SearchServices.getCatImage(id)
        .then((body) => {
          return body.json();
        });
      return res;
    } catch (e) {
      ApiErrorHandler(e);
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
        setState(prevState => [...res, ...prevState]);
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

      {!isEmpty ? (
        state.map((result, index) =>
          result.breeds.map((subItems) => (
            <div key={index}>
              <ListItemComponent
                name={subItems.name}
                weight={subItems.weight.imperial}
                lifeSpan={subItems.life_span}
                imgUrl={result.url}
                loading={loading}
              />
            </div>
          ))
        )
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
