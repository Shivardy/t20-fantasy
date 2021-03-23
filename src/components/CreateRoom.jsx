import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { Redirect } from 'react-router';
import { createRoom } from '../api';
import { Context } from './App';
const CreateRoom = () => {
  const {
    state: { isCreateRoomOpen, user },
    dispatch,
  } = useContext(Context);
  const [formData, setFormData] = useState({
    name: '',
    participantCount: '',
  });

  const { name, participantCount } = formData;

  const handleClose = () => dispatch({ type: 'toggleCreateRoom' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && participantCount)
      return await createRoom({ ...formData, userId: user.uid });
  };
  const { data, isError, isLoading, isSuccess, mutate } = useMutation(
    handleSubmit
  );

  if(isSuccess && data) return <Redirect to ={`/room/${data.id}`} noThrow/>
  return (
    <Dialog
      open={isCreateRoomOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create Room</DialogTitle>
      <DialogContent>
        {isLoading && (
          <CircularProgress />
        )}
        {isError && <div>Error..</div>}
        {!(isLoading || isError || isSuccess) && (
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              id="name"
              label="Enter Room Name"
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              type="text"
              margin="normal"
              required
              fullWidth
            />
            <TextField
              id="participantCount"
              label="Enter Number Of Participants"
              type="number"
              value={participantCount}
              onChange={(e) =>
                setFormData({ ...formData, participantCount: e.target.value })
              }
              required
              margin="normal"
              fullWidth
            />
            <DialogActions>
              <Button
                onClick={mutate}
                type="submit"
                color="primary"
                disabled={!(name && participantCount)}
              >
                Create
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoom;
