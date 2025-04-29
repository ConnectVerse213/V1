import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { useOkto } from "okto-sdk-react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '../assets/images/logo.png'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from '@mui/icons-material/Home';
import PaidIcon from '@mui/icons-material/Paid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import './ResponsiveAppBar.css'

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar({homeButtonStyle,earnButtonStyle,createButtonStyle,dashboardButtonStyle}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

   const { showWidgetModal, closeModal } = useOkto();
   const { createWallet, getUserDetails, getPortfolio } = useOkto();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" style={{backgroundColor:'black',color:'#1876d1'}}>
      <Container maxWidth="xl" style={{backgroundColor:'black'}}>
        <Toolbar disableGutters>
         
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
            
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
           <img src={logo} style={{width:'2em'}} ></img>
           
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"

            >
              <MenuIcon />
            </IconButton>
            <Menu 
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{
                sx: {
                  backgroundColor: 'black', // Set background to black
                  color: 'white',            // (optional) text color white so text is visible
                },
              }}
            >
             
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }} ><Button variant={homeButtonStyle} onClick={()=>{
            window.location.href="/home2"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><HomeIcon fontSize='small'/> <l>Home</l></div></Button></Typography>
                </MenuItem>
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant={earnButtonStyle}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><PaidIcon fontSize='small'/> <l>Earn</l></div></Button></Typography>
                </MenuItem>
                <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}><Button variant={createButtonStyle} onClick={()=>{
            window.location.href="/creator"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><AddCircleOutlineIcon fontSize='small'/> <l>Create</l></div></Button></Typography>
                </MenuItem>
            
            </Menu>
          </Box>
         
          
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
             
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src={logo} style={{width:'2em'}} ></img>
          
             
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            
          
          <Button variant={homeButtonStyle} onClick={()=>{
            window.location.href="/home2"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><HomeIcon fontSize='small'/> <l>Home</l></div></Button>
          <Button variant={earnButtonStyle}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><PaidIcon fontSize='small'/> <l>Earn</l></div></Button>
          <Button variant={createButtonStyle} onClick={()=>{
            window.location.href="/creator"
          }}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><AddCircleOutlineIcon fontSize='small'/> <l>Create</l></div></Button>
          </Box>
          <Box sx={{ flexGrow: 0 }} >

<div class="flexWala">
          <Button variant={dashboardButtonStyle} onClick={()=>{
            window.location.href="/dashboard"
          }}>Dashboard</Button>
          <Button variant="outlined" onClick={()=>{
              showWidgetModal()
            }}><AccountBalanceWalletIcon /></Button>
          
            </div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
