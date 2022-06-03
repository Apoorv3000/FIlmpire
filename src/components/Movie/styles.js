import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  movie: {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
  },
  title: {
    color: theme.palette.text.primary,
    textOverflow: "ellipsis",
    width: "230px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginTop: "10px",
    marginBottom: 0,
    textAlign: "center",
  },
  links: {
    alignItems: "center",
    fontWeight: "bolder",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer",
    },
  },
  image: {
    borderRadius: "20px",
    height: "300px",
    marginBottom: "10px",
    transitionDuration: "200ms",
    boxShadow: ".3rem 0.2rem 0.3rem rgba(0,0,0,.5)",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
}));
