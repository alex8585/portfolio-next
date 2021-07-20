import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Link from 'next/link'
import List from '@material-ui/core/List';
import { useRouter } from 'next/router'

import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles((theme) => ({
  link: {
    "& .active": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
    }
  },
}))

const LeftMenu = () => {
  
  const { asPath } = useRouter()
  
  const classes = useStyles()

  return (
    <div>
      <List className={classes.link}>

        <Link  href="/admin" >
            <ListItem button className={ asPath == '/admin' ? 'active': ""}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
        </Link>

        <Link  href="/admin/tags" >
            <ListItem button className={ asPath == '/admin/tags' ? 'active':""}>
                <ListItemIcon>
                <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Tags" />
            </ListItem>
        </Link>

        <Link  href="/admin/portfolios" >
            <ListItem button className={ asPath == '/admin/portfolios' ? 'active':""}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Portfolios" />
            </ListItem>
        </Link>


        
      </List>

      
    </div>
  )
}
export default LeftMenu