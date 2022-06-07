import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import alanBtn from "@alan-ai/alan-sdk-web";
import { ColorModeContext } from "../utils/ToggleColorMode";
import { fetchToken } from "../utils";
import {
  searchMovie,
  selectGenreOrCategory,
} from "../features/currentGenreorCategory";

// f50134ddf29a4855d5bb33489a955ce22e956eca572e1d8b807a3e2338fdd0dc/stage
const useAlan = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setMode } = useContext(ColorModeContext);
  useEffect(() => {
    alanBtn({
      key: "f50134ddf29a4855d5bb33489a955ce22e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command, mode, genreOrCategory, genres, query }) => {
        if (command === "chooseGenre") {
          const foundGenre = genres.find(
            (g) => g.name.toLowerCase() === genreOrCategory.toLowerCase(),
          );
          if (foundGenre) {
            history.push("/");
            dispatch(selectGenreOrCategory(foundGenre.id));
          } else {
            const category = genreOrCategory.startsWith("top")
              ? "top_rated"
              : genreOrCategory;

            history.push("/");
            dispatch(selectGenreOrCategory(category));
          }
        } else if (command === "changeMode") {
          // Call the client code that will react to the received command
          if (mode === "light") {
            setMode("light");
          } else {
            setMode("dark");
          }
        } else if (command === "login") {
          fetchToken();
        } else if (command === "logout") {
          localStorage.clear();
          window.location.href = "/";
        } else if (command === "search") {
          dispatch(searchMovie(query));
        }
      },
    });
  }, []);
};

export default useAlan;
