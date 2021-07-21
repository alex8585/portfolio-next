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
import { setPortfolios, getPortfolios } from "../../../actions/portfolioActions"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import Portfolio from "../../../models/portfolioModel"
import Image from "next/image"

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

  const dispatch = useDispatch()

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

  return (
    <AdminLayout>
      <Box sx={{ width: "100%" }}>
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
      await store.dispatch(setPortfolios(portfolios, initPerPage, total))
      return null
    }
)

export default Portfolios
