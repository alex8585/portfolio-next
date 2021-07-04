import React from "react"
import Typography from "@material-ui/core/Typography"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
//import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
//import Link from "@material-ui/core/Link"
import { NavLink } from "react-router-dom"
const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    //margin: theme.spacing(1, 1.5),
    fontSize: "0.875rem",
    fontWeight: "600",
    lineHeight: "1.75",
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
    color: "rgba(0, 0, 0, 0.87)",
    margin: "8px 12px",
    textDecoration: "none",
  },
}))

const TopMenu = () => {
  const classes = useStyles()
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          className={classes.toolbarTitle}
        >
          Alex85 programmer
        </Typography>
        <nav>
          <NavLink
            variant="button"
            color="textPrimary"
            to="/"
            className={classes.link}
          >
            Portfolio
          </NavLink>
          <NavLink
            variant="button"
            color="textPrimary"
            to="/about"
            className={classes.link}
          >
            About me
          </NavLink>
        </nav>
        {/* <Button
          href="#"
          color="primary"
          variant="outlined"
          className={classes.link}
        >
          Login
        </Button> */}
      </Toolbar>
    </AppBar>
  )
}

export default TopMenu
