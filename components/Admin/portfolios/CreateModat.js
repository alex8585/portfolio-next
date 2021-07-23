import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import React from "react"
import useFormValues from "../../../hooks/useFormValues"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import Chip from "@material-ui/core/Chip"
import Box from "@material-ui/core/Box"

export default function CreateModat({ open, handleClose, handleSubmit, tags }) {
  const [values, handleChange] = useFormValues({
    name: "",
    img: "",
    url: "",
    order_number: "",
    tags: [],
  })
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new portfolio</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => handleChange(e)}
            name="name"
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={values.name}
          />

          <TextField
            onChange={(e) => handleChange(e)}
            name="img"
            autoFocus
            margin="dense"
            id="img"
            label="Image"
            type="text"
            fullWidth
            variant="standard"
            value={values.img}
          />

          <TextField
            onChange={(e) => handleChange(e)}
            name="url"
            autoFocus
            margin="dense"
            id="url"
            label="Url"
            type="text"
            fullWidth
            variant="standard"
            value={values.url}
          />

          <TextField
            onChange={(e) => handleChange(e)}
            name="order_number"
            autoFocus
            margin="dense"
            id="order_number"
            label="Order"
            type="text"
            fullWidth
            variant="standard"
            value={values.order_number}
          />
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="multiple-tags-label">Tags</InputLabel>
            <Select
              name="tags"
              labelId="multiple-tags-label"
              id="multiple-tags"
              multiple
              value={values.tags}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {selected.map((tag) => (
                    <Chip key={tag.id} label={tag.name} sx={{ m: "2px" }} />
                  ))}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={{ id: tag.id, name: tag.name }}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit(values)}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
