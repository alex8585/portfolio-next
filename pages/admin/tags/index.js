import AdminLayout from "../../../components/Admin/AdminLayout"
import React, { useState, useEffect } from "react"
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
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import { visuallyHidden } from "@material-ui/utils"
import { wrapper } from "../../../store"
import dbConnect from "../../../utils/dbConnect"
import Tag from "../../../models/tagModel.js"
import {
  getTags,
  setTags,
  createNewTag,
  deleteTag,
} from "../../../actions/tagActions"
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@material-ui/styles"
import moment from "moment"
import CreateTagModat from "../../../components/Admin/CreateTagModat.js"
import DeleteConfirmModal from "../../../components/Admin/DeleteConfirmModal"
const useStyles = makeStyles((theme) => ({
  topBtnsWrapp: {
    margin: "15px 0",
  },
}))

const headCells = [
  {
    id: "id",
    sortable: true,
    label: "ID",
  },
  {
    id: "name",
    sortable: true,
    label: "Name",
  },
  {
    id: "createdAt",
    sortable: true,
    label: "Created at",
  },
  {
    id: "actions",
    sortable: false,
    label: "Actions",
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
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
            {!headCell.sortable && <span>{headCell.label}</span>}
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

const Tags = () => {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("name")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initPerPage)

  const classes = useStyles()
  const dispatch = useDispatch()

  // Avoid a layout jump when reaching the last page with empty tags.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total) : 0

  const handleRequestSort = (event, field) => {
    const isAsc = orderBy === field && order === "asc"
    const newOrder = isAsc ? "desc" : "asc"
    setOrder(newOrder)
    setOrderBy(field)
    dispatch(getTags(page + 1, rowsPerPage, newOrder, field))
  }

  const { data: tags, total } = useSelector((state) => state.tagList)

  const handleChangePage = (event, newPage) => {
    dispatch(getTags(newPage + 1, rowsPerPage, order, orderBy))
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    let perPage = parseInt(event.target.value, 10)
    dispatch(getTags(1, perPage, order, orderBy))
    setRowsPerPage(perPage)
    setPage(0)
  }

  const dateFormat = (timestamp) => {
    timestamp = parseInt(timestamp)
    return moment(timestamp).format("DD-MM-YYYY:HH:MM")
  }

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false)
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
    await dispatch(createNewTag(values))
    await dispatch(getTags(page + 1, rowsPerPage, order, orderBy))
    setOpenCreateModal(false)
  }

  const handleOpenDeleteConfirmModel = (row) => {
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

  return (
    <AdminLayout>
      <CreateTagModat
        handleSubmit={createSubminHanler}
        open={openCreateModal}
        handleClose={closeCreateModalHandler}
      />
      <DeleteConfirmModal
        currentRow={currentRow}
        handleConfirm={handleDeleteConfirm}
        open={openDeleteConfirmModal}
        handleClose={closeDeleteConfirmModalHandler}
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
                rowCount={tags.length}
              />
              <TableBody>
                {tags.slice().map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell> {row.id}</TableCell>
                      <TableCell> {row.name}</TableCell>
                      <TableCell align="left">
                        {dateFormat(row.createdTs)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDeleteConfirmModel(row)}
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
      let tags = await Tag.find().limit(initPerPage)
      let total = await Tag.countDocuments()
      tags = JSON.parse(JSON.stringify(tags))
      await store.dispatch(setTags(tags, total))
      return null
    }
)

export default Tags
