import React, { useEffect } from "react";
import { userSelector } from "../../features/auth";
import { useSelector } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { useGetListsQuery } from "../../services/TMDB";
import { RatedCards } from "..";

const Profile = () => {
  const { user } = useSelector(userSelector);

  const { data: favorites, refetch: refetchFavorites } = useGetListsQuery({
    listName: "/favorite/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  const { data: watchlists, refetch: refetchWatchlist } = useGetListsQuery({
    listName: "/watchlist/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  useEffect(() => {
    refetchFavorites();
    refetchWatchlist();
  }, []);

  const logout = () => {
    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      {!favorites?.results?.length && !watchlists?.results?.length ? (
        <Typography variant="h5">
          Add favorites or watchlist some movies to see them here
        </Typography>
      ) : (
        <Box>
          <RatedCards title="Favorite Movies" data={favorites} />
          <RatedCards title="Watchlist" data={watchlists} />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
