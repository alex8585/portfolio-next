
import  React,{ useEffect } from "react"

import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"

import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import CssBaseline from "@material-ui/core/CssBaseline"
import Grid from "@material-ui/core/Grid"

import Typography from "@material-ui/core/Typography"

import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"

import { useDispatch, useSelector } from "react-redux"

import { listTags, filterByTags } from "../actions/tagActions"

import { listPortfolios } from "../actions/portfolioActions"
import Pagination from "@material-ui/lab/Pagination"

import CardMedia from "@material-ui/core/CardMedia"

import { red } from "@material-ui/core/colors"
import TopMenu from "../components/TopMenu"
import Footer from "../components/Footer"

import Chip from "@material-ui/core/Chip"
import Paper from "@material-ui/core/Paper"
import { initializeStore } from '../store'
import { wrapper } from '../store'

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },

  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(3, 0, 3),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },

  chip: {
    margin: theme.spacing(0.5),
  },
  root: {
    maxWidth: 345,
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
    "& .active .MuiButtonBase-root": {
      backgroundColor: "rgb(144, 131, 112)",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  button: {
    marginTop: "5px",
    width: "100%",
    textAlign: "center",
  },
  paginatorContainer: {
    display: "flex",
    marginTop: 10,
  },
  pagination: {
    margin: "0 auto",
    "& ul": {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
    },
  },
}))

const Index = ({ match, location, history }) => {
  const classes = useStyles()

  const dispatch = useDispatch()
  //let i = useParams()
  //let query = useQuery()

  const portfolioList = useSelector((state) => state.portfolioList)
  const { data: tags, loading: tagsloading } = useSelector(
    (state) => state.tagList
  )
  const { data, page, pages, loading } = portfolioList

  useEffect(() => {
    // dispatch(listTags(1))
  }, [dispatch])

  useEffect(() => {
    if(!tags.length) return    
     dispatch(listPortfolios(1, 6, tags))
  }, [dispatch, tags])

  let handleChangePage = (event, value) => {
    dispatch(listPortfolios(value, 6, tags))
  }

  let handletagFilter = (id) => {
    dispatch(filterByTags(id))
    //dispatch(listPortfolios(1, 6, tags))
  }

  if (!data.length ) return "loading..."
  return (
    <React.Fragment>
      <CssBaseline />
      <TopMenu />

      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Portfolio
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        ></Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <ul className={classes.paper}>
          {[...tags]
            .sort((a, b) => (a.order_number > b.order_number ? 1 : -1))
            .map((tag) => {
              return (
                <li key={tag.id} className={tag.active ? "active" : ""}>
                  <Chip
                    label={tag.name}
                    onClick={() => handletagFilter(tag.id)}
                    className={classes.chip}
                  />
                </li>
              )
            })}
        </ul>
        <Grid container spacing={5} alignItems="flex-end">
          {data.map((portfolio) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={portfolio.name} xs={12} sm={6} md={4}>
              <Card className={classes.root}>
                <CardHeader title={portfolio.name} subheader="" />
                <CardMedia
                  className={classes.media}
                  image={portfolio.img}
                  title="Paella dish"
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {portfolio.description ? portfolio.description : ""}
                  </Typography>
                  {/* <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </CardActions> */}
                  <Paper component="ul" className={classes.paper}>
                    {[...portfolio.tags]
                      .sort((a, b) =>
                        a.order_number > b.order_number ? 1 : -1
                      )
                      .map((tag) => {
                        return (
                          <li key={tag.id}>
                            <Chip label={tag.name} className={classes.chip} />
                          </li>
                        )
                      })}
                  </Paper>
                  {portfolio.url.indexOf("github") !== -1 && (
                    <Button
                      target="_blank"
                      className={classes.button}
                      variant="contained"
                      color="secondary"
                      href={portfolio.url}
                    >
                      Github
                    </Button>
                  )}
                  {portfolio.url.indexOf("github") === -1 && (
                    <Button
                      target="_blank"
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      href={portfolio.url}
                    >
                      View
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div className={classes.paginatorContainer}>
          <Pagination
            page={page}
            count={pages}
            onChange={handleChangePage}
            className={classes.pagination}
          />
        </div>
      </Container>

      <Footer />
    </React.Fragment>
  )
}

export const getStaticProps = wrapper.getStaticProps(store =>
    ({preview}) => {
      // console.log('2. Page.getStaticProps uses the store to dispatch things');
      store.dispatch(listTags(1))
    }
);

// export function getServerSideProps() {
  // const reduxStore = initializeStore()
  // const { dispatch } = reduxStore
  // dispatch(listTags(1))
  // return { props: { initialReduxState: reduxStore.getState() } }
//   // return { props: {} }
// }
// export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
 //  store.dispatch(listTags(1))
 // store.dispatch(serverRenderClock(true))
  //store.dispatch(addCount())
// })
export default Index
