import {
  AppBar,
  Avatar,
  Button,
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { auth, signInWithGoogle } from '../firebase';
import { Context } from './App';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MenuBar = () => {
  const {
    state: { title, user },
  } = useContext(Context);

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>

        {user ? (
          <>
            <IconButton
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              size="medium"
              color="inherit"
            >
              <Avatar alt={user.displayName} src={user.photoURL} />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              <Paper>
                <ClickAwayListener onClickAway={handleToggle}>
                  <MenuList autoFocusItem={open} id="menu-list-grow">
                    <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </>
        ) : (
          <Button
            color="secondary"
            size="small"
            variant="contained"
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
