import React,{useState,useEffect} from 'react';
//clsx for creating classsname Conditionally using boolean and Strings
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import DashboardList from "./DashboardList";
import Avatar from '@material-ui/core/Avatar';
import Register from "./Register";
import { Icon} from '@iconify/react';
import json2mq from 'json2mq';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import beamingFaceWithSmilingEyes from '@iconify-icons/emojione/beaming-face-with-smiling-eyes';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import InboxIcon from '@material-ui/icons/MoveToInbox';

import { NotificationContainer, NotificationManager } from 'react-notifications';

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  root: {
    display: 'flex',
    '& .makeStyles-drawerPaperClose-29': {
      width: '72px'
  },
  
  '& .makeStyles-drawerPaperClose-49': {
    width: '72px'
},

    '& .makeStyles-drawerPaperClose-11': {
      width: '72px'
  },
  '& .makeStyles-drawerPaperClose-87': {
    width: '72px'
},
'& .makeStyles-drawerPaperClose-50': {
  width: '72px'
},
'& .makeStyles-drawerPaperClose-89': {
  width: '72px'
},
'& .makeStyles-drawerPaperClose-128': {
  width: '72px'
},

'& .makeStyles-drawerPaperClose-23': {
  width: '72px'
},

  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    fontFamily: ' Verdana, Arial, Helvetica, sans-serif',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer:theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    '&.makeStyles-container-14' :{
      paddingTop: '0px',
      paddingBottom: '0px',
  },
  '&.makeStyles-container-53' :{
    paddingTop: '0px',
    paddingBottom: '0px',
},
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  yo:{
    paddingLeft: '0px', 
    paddingRight: '0px',
    paddingTop: '0px', 
    marginTop:"20px",
  }
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const [getAdmin,setAdmin]=useState(null)
  const [getView,setView]=useState(<Register />) 
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();
  let history = useHistory();
  // console.log("dash",history)
  const matches = useMediaQuery(
    json2mq({
      maxWidth: 900,
    }),
  );
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawer  =() =>{
    setOpen(true);
  }

  const handleView=(value)=>{
    if(value===50)
    {
      localStorage.clear();

      NotificationManager.success("Logout Successfull");
      setTimeout(() => {
        dispatch({ type: "SET_LOGOUT" })
         NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({ id: n.id }) )
     }, 800);
    }
    else{
 setView(value)
    }

  }
  const checkStorage=()=>{
   if(!localStorage.getItem("user"))
   {
    history.replace({pathname:'/'})
   }
  else{
    var data=JSON.parse(localStorage.getItem("user"))
     console.log(data)
     setAdmin(data)
  }

  }
  const updateWindowWidth = () => {
    if (window.innerWidth < 900) setOpen(false);
    else setOpen(true);
  }
   // Update of sidebar state
   useEffect(() => {

    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, [open]);
  
  useEffect(() => { 
    checkStorage();  
    updateWindowWidth();
  }, [])
  return (
    <>
    <NotificationContainer />
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
           Welcome : &nbsp;
         {getAdmin?getAdmin.name:<></>
          } &nbsp;
          <Icon  width={27} height={27} icon={beamingFaceWithSmilingEyes}  />
          </Typography>
          <IconButton color="inherit">
          {getAdmin?<Avatar alt="Admin" src="https://png.pngtree.com/png-vector/20191122/ourmid/pngtree-beautiful-admin-roles-glyph-vector-icon-png-image_2002847.jpg" className={classes.large} />:<></>}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
         <span style={{fontWeight:"bold",fontSize:"17px",
  fontFamily: " Times, Times New Roman, Georgia, serif",padding:"26px 0px 26px 0px"}}><InboxIcon />{`ADMIN Dashboard`} </span> 
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
    
         
        <DashboardList handleDrawer={handleDrawer} handleView={handleView}/>
       
        <Divider />
         
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {/* classes={{root:... , contextprimary:  ... }}  or by METHOD OVERRIDES! */}
        <Container maxWidth="lg" className={classes.container} classes={{root:classes.yo}}>         
        
        {getView}
        </Container>
      </main>
    </div>
    </>
  );
}