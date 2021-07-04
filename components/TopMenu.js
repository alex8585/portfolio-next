import React from "react"
import Typography from "@material-ui/core/Typography"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { makeStyles } from "@material-ui/core/styles"
import Link from 'next/link'

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
    "& a":{
      fontSize: "0.875rem",
      fontWeight: "600",
      lineHeight: "1.75",
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
      color: "rgba(0, 0, 0, 0.87)",
      margin: "8px 12px",
      textDecoration: "none",
    }
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
        <nav className={classes.link}  >
           
          <Link
            href="/"
            
          >
            Portfolio
          </Link>
          <Link
            href="/about"
          >
            About me
          </Link>
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
