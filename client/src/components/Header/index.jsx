import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/system';
import { logOut } from '../../slice/userSlice';
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HeaderLink = styled(Button)({
	marginLeft: 9,
	textTransform: 'none'
});

export default function Header(){
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const [anchorElUser, setAnchorElUser] = useState(null);
	
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const logOutUser = () => {
		localStorage.removeItem('accessToken');
		dispatch(logOut());
		window.location = '/';
	}

	return (
		<AppBar position="static">
		<Container maxWidth="xl">
			<Toolbar disableGutters>
				<Typography
					variant="h6"
					noWrap
					component={Link}
					sx={{flexGrow: 1, mr: 2, display: 'flex' }}
					style={{textDecoration: 'none', color: 'white'}}
					to="/"
				>
					Բաղադրատոմսեր
				</Typography>

				<Box sx={{ flexGrow: 0 }}>
					{ user.isLoggedIn ? (
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<AccountCircleIcon fontSize="large" style={{ color: 'white' }} />
							</IconButton>
						</Tooltip>
					) : (
						<>
							<HeaderLink variant="outlined" component={Link} color="inherit" to="/login">Մուտք</HeaderLink>
							<HeaderLink variant="outlined" component={Link} color="inherit" to="/registration">Գրանցում</HeaderLink>
						</>
					)}

					<Menu
						sx={{ mt: '45px' }}
						anchorEl={anchorElUser}
						anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
						keepMounted
						transformOrigin={{ vertical: 'top', horizontal: 'right', }}
						open={Boolean(anchorElUser)}
						onClose={handleCloseUserMenu}
					>
						<MenuItem key="admin" component={Link} to="/admin">
							<Typography textAlign="center">Վահանակ</Typography>
						</MenuItem>
						<MenuItem key="logout" onClick={logOutUser}>
							<Typography textAlign="center">Ելք</Typography>
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</Container>
		</AppBar>
	);
};
