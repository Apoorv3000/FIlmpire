import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating,
  Grid,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from "@mui/icons-material";

import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  useGetListsQuery,
  useGetMovieQuery,
  useGetRecommendationQuery,
  useGetWatchProviderQuery,
} from "../../services/TMDB";
import useStyles from "./styles";
import genreIcon from "../../assets/genres";

import { selectGenreOrCategory } from "../../features/currentGenreorCategory";
import { MovieList } from "..";
import { userSelector } from "../../features/auth";

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data, isFetching, error } = useGetMovieQuery(id);

  const { data: favorites } = useGetListsQuery({
    listName: "/favorite/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: watchlists } = useGetListsQuery({
    listName: "/watchlist/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: recommendation, isFetching: isLoading } =
    useGetRecommendationQuery({
      list: "/recommendations",
      movie_id: id,
    });

  const { data: watchProvider, isFetching: isfetching } =
    useGetWatchProviderQuery(id);

  const hour = Math.trunc(data?.runtime / 60);
  const index = data?.videos.results.findIndex(
    (element) => element.type === "Trailer" || "Teaser",
  );

  useEffect(() => {
    setIsMovieFavorited(
      !!favorites?.results?.find((movie) => movie?.id === data?.id),
    );
  }, [favorites, data]);

  useEffect(() => {
    setIsMovieWatchlisted(
      !!watchlists?.results?.find((movie) => movie?.id === data?.id),
    );
  }, [watchlists, data]);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.tmdb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      { media_type: "movie", media_id: id, favorite: !isMovieFavorited },
    );
    setIsMovieFavorited((prevFavorite) => !prevFavorite);
  };

  const addToWatchLists = async () => {
    await axios.post(
      `https://api.tmdb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        watchlist: !isMovieWatchlisted,
      },
    );
    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something has gone wrong - Go back </Link>
      </Box>
    );
  }
  const watchProviderData = watchProvider?.results?.US;

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid
        item
        sm={12}
        lg={4}
        style={{
          display: "flex",
          marginBottom: "30px",
          flexDirection: "column",
        }}
      >
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data?.release_date.split("-")[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data?.vote_average / 2} />
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginLeft: "10px" }}
            >
              {data?.vote_average}/10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {hour}hr and {data?.runtime % 60}min /{" "}
            {moment(data?.release_date).format("MMM-YYYY")}
            {` / Language: ${data?.spoken_languages[0].name}`}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
            <Link
              key={genre.name}
              className={classes.links}
              to="/"
              onClick={() => {
                dispatch(selectGenreOrCategory(genre.id));
              }}
            >
              <img
                src={genreIcon[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
                alt=""
              />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Grid item className={classes.genresContainer}>
          {(
            watchProviderData?.flatrate ||
            watchProviderData?.buy ||
            watchProviderData?.rent
          )
            ?.slice(0, 4)
            ?.map((Provider, i) => (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginBottom: "3px",
                  alignItems: "center",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${Provider.logo_path}`}
                  className={classes.genreImage}
                  height={30}
                  alt=""
                />
                <Typography color="textPrimary" variant="subtitle1" key={i}>
                  {Provider?.provider_name}
                </Typography>
              </div>
            ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: "2rem" }}>
          {data?.overview}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data &&
            data.credits?.cast
              ?.map(
                (character, i) =>
                  character.profile_path && (
                    <Grid
                      key={i}
                      item
                      xs={4}
                      md={2}
                      component={Link}
                      to={`/actors/${character.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        className={classes.castImage}
                        src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        alt={character.name}
                      />
                      <Typography color="textPrimary">
                        {character?.name}
                      </Typography>
                      <Typography color="textSecondary">
                        {character.character.split("/")[0]}
                      </Typography>
                    </Grid>
                  ),
              )
              .slice(0, 10)}
        </Grid>
        <Grid item container style={{ marginTop: "2rem" }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  Website
                </Button>
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  href="#"
                  endIcon={<Theaters />}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  endIcon={
                    isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />
                  }
                >
                  {isMovieFavorited ? "Unfavorite" : "Favorite"}
                </Button>
                <Button
                  onClick={addToWatchLists}
                  endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
                >
                  Watchlist
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: "primary.main" }}
                >
                  <Typography
                    component={Link}
                    to="/"
                    color="inherit"
                    variant="subtitle2"
                    style={{ textDecoration: "none" }}
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {/* Loop through recommended movies */}
        {recommendation ? (
          <MovieList movies={recommendation} numberOfMovies={12} />
        ) : (
          <Box>Sorry,Nothing was found</Box>
        )}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
          <iframe
            autoPlay
            className={classes.videos}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${data?.videos?.results[index]?.key}`}
            allow="autoplay"
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
