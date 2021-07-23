import AdminLayout from "../../../components/Admin/AdminLayout"
import React, { useState } from "react"
import PropTypes from "prop-types"
import Box from "@material-ui/core/Box"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"

import Paper from "@material-ui/core/Paper"
import { visuallyHidden } from "@material-ui/utils"
import { wrapper } from "../../../store"
import dbConnect from "../../../utils/dbConnect"
import { setPortfolios, getPortfolios,createNewPortfolio } from "../../../actions/portfolioActions"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import Portfolio from "../../../models/portfolioModel"
import Image from "next/image"
import CreateModat from "../../../components/Admin/portfolios/CreateModat.js"
import EditModal from "../../../components/Admin/portfolios/EditModal"
import DeleteConfirmModal from "../../../components/Admin/DeleteConfirmModal"
import { makeStyles } from "@material-ui/styles"
import Button from "@material-ui/core/Button"
import Tag from "../../../models/tagModel.js"
import {
  getTags,
  setTags,
  createNewTag,
  deleteTag,
  editTag,
} from "../../../actions/tagActions"
const useStyles = makeStyles((theme) => ({
  topBtnsWrapp: {
    margin: "15px 0",
  },
  actionButton: {
    "& .MuiButton-root.MuiButton-contained.MuiButton-containedPrimary": {
      margin: "0px 5px",
    },
  },
}))
const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "img",
    numeric: false,
    disablePadding: false,
    label: "Img",
  },
  {
    id: "url",
    numeric: true,
    disablePadding: false,
    label: "Url",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Created at",
  },
]

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

let initPerPage = 5

const Portfolios = () => {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initPerPage)

  const classes = useStyles()
  const dispatch = useDispatch()

  const handleRequestSort = (event, field) => {
    const isAsc = orderBy === field && order === "asc"
    const newOrder = isAsc ? "desc" : "asc"
    setOrder(newOrder)
    setOrderBy(field)
    dispatch(getPortfolios(page + 1, rowsPerPage, newOrder, field))
  }

  const { data: portfolios, total } = useSelector(
    (state) => state.portfolioList
  )
  const { data: tags } = useSelector((state) => state.tagList)

  const handleChangePage = (event, newPage) => {
    dispatch(getPortfolios(newPage + 1, rowsPerPage, order, orderBy))
    setPage(newPage)
  }
  const handleRowClick = (e, id) => {
    // console.log(id);
  }
  const handleChangeRowsPerPage = (event) => {
    let perPage = parseInt(event.target.value, 10)
    dispatch(getPortfolios(1, perPage, order, orderBy))
    setRowsPerPage(perPage)
    setPage(0)
  }

  const dateFormat = (timestamp) => {
    timestamp = parseInt(timestamp)
    return moment(timestamp).format("DD-MM-YYYY:HH:MM")
  }

  // Avoid a layout jump when reaching the last page with empty portfolios.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [currentRow, setCurrentRow] = useState({})

  const openCreateModalHandler = () => {
    setOpenCreateModal(true)
  }

  const closeCreateModalHandler = () => {
    setOpenCreateModal(false)
  }
  const createSubminHanler = async (values) => {
    if (!values.name) {
      return
    }
    await dispatch(createNewPortfolio(values))
    await dispatch(getPortfolios(page + 1, rowsPerPage, order, orderBy))
    setOpenCreateModal(false)
  }

  const handleOpenDeleteConfirmModal = (row) => {
    setCurrentRow(row)
    setOpenDeleteConfirmModal(true)
  }

  const closeDeleteConfirmModalHandler = () => {
    setOpenDeleteConfirmModal(false)
  }

  const handleDeleteConfirm = async () => {
    dispatch(deleteTag(currentRow.id))
    await dispatch(getTags(page + 1, rowsPerPage, order, orderBy))
    setOpenDeleteConfirmModal(false)
  }

  const handleOpenEditModal = (row) => {
    setCurrentRow(row)
    setOpenEditModal(true)
  }

  const closeEditModalHandler = () => {
    setOpenEditModal(false)
  }

  const handleEditSubmit = async () => {
    //console.log(currentRow)
    dispatch(editTag(currentRow))
    await dispatch(getTags(page + 1, rowsPerPage, order, orderBy))
    setOpenEditModal(false)
  }
  return (
    <AdminLayout>
      <CreateModat
        tags={tags}
        handleSubmit={createSubminHanler}
        open={openCreateModal}
        handleClose={closeCreateModalHandler}
      />
      <Box sx={{ width: "100%" }}>
        <div className={classes.topBtnsWrapp}>
          <Button variant="contained" onClick={() => openCreateModalHandler()}>
            Create
          </Button>
        </div>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={portfolios.length}
              />
              <TableBody>
                {portfolios.slice().map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, row.id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell> {row.id}</TableCell>
                      <TableCell> {row.name}</TableCell>
                      <TableCell>
                        <Image
                          src={"/" + row.img}
                          alt={row.name}
                          width={100}
                          height={75}
                        />
                      </TableCell>
                      <TableCell> {row.url}</TableCell>

                      <TableCell align="left">
                        {" "}
                        {dateFormat(row.createdTs)}{" "}
                      </TableCell>
                      <TableCell className={classes.actionButton}>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenEditModal(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDeleteConfirmModal(row)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </AdminLayout>
  )
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ preview }) => {
      await dbConnect()
      let portfolios = await Portfolio.find().limit(initPerPage)
      let total = await Portfolio.countDocuments()
      portfolios = JSON.parse(JSON.stringify(portfolios))

      let tags = await Tag.find()
      let totalTags = await Tag.countDocuments()
      tags = JSON.parse(JSON.stringify(tags))

      await store.dispatch(setPortfolios(portfolios, initPerPage, total))
      await store.dispatch(setTags(tags, totalTags))

      return null
    }
)

export default Portfolios
