import React, { useState } from "react";
import { useGetActorQuery, useGetActorMoviesQuery } from "../../services/TMDB";
import { ArrowBack } from "@mui/icons-material";
import { Typography, Box, CircularProgress, Grid, Button } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { MovieList } from "..";
import useStyles from "./styles";
import { Pagination } from "..";

const Actors = () => {
  const { id } = useParams();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const { data, isFetching, error } = useGetActorQuery(id);
  const { data: movies } = useGetActorMoviesQuery({ id, page });
  console.log(data);

  console.log(movies);

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => history.goBack()}
          color="primary"
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4}>
          <img
            className={classes.poster}
            src={`https://image.tmdb.org/t/p/w500/${data?.profile_path}`}
            alt={data?.name}
          />
        </Grid>
        <Grid
          item
          lg={7}
          xl={8}
          direction="column"
          display="flex"
          justifyContent="center"
        >
          <Typography variant="h2" align="left" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Born:{new Date(data?.birthday).toDateString()}
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            {data?.biography || "Sorry,no biography yet!!"}
          </Typography>
          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              target="_blank"
              color="primary"
              rel="noopener noreferrer"
              href={`https://www.imdb.com/name/${data.imdb_id}`}
            >
              IMDB
            </Button>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => history.goBack()}
              color="primary"
            >
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h2" align="center" gutterBottom>
          Movies
        </Typography>
        {movies ? (
          <MovieList movies={movies} numberOfMovies={12} />
        ) : (
          <Box>Sorry,Nothing was found</Box>
        )}
        <Pagination
          currentPage={page}
          setPage={setPage}
          totalPages={movies?.total_pages}
        />
      </Box>
    </>
  );
};

export default Actors;
