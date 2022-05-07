import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { Link } from 'react-router-dom';
import { logOut } from '../../slice/userSlice';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CategoryIcon from '@mui/icons-material/Category';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';



const drawerWidth = 240;

const menuLinks = [
    {
        title: 'Գլխավոր',
        slug: '/admin',
        icon: <HomeIcon />
    },
    {
        title: 'Բաղադրատոմսեր',
        slug: '/admin/recipes',
        icon: <KitchenIcon />
    },
    {
        title: 'Կատեգորիաներ',
        slug: '/admin/categories',
        icon: <CategoryIcon />
    },
    {
        title: 'Բաղադրիչներ',
        slug: '/admin/ingredients',
        icon: <FeaturedPlayListIcon />
    },
    {
        title: 'Օգտատերեր',
        slug: '/admin/users',
        icon: <PersonOutlineIcon />,
    }
];


export default function AdminLayout({ children, pagename }) {
    const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [anchorElUser, setAnchorElUser] = useState(null);

    const chackMenuAccess = (caps = []) => {
        return caps.length === 0 ? true : caps.includes(user.meta.role);
    }

	const logOutUser = () => {
		localStorage.removeItem('accessToken');
		dispatch(logOut());
		window.location = '/';
	}

	
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
    <SnackbarProvider maxSnack={5} autoHideDuration={2500}>
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
			>
				<Toolbar style={{justifyContent: 'space-between'}}>
					<Typography variant="h6" noWrap component="div">
						{pagename ? pagename : ''}
					</Typography>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<AccountCircleIcon fontSize="large" style={{ color: 'white' }} />
							</IconButton>
						</Tooltip>

						<Menu
							sx={{ mt: '45px' }}
							anchorEl={anchorElUser}
							anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
							keepMounted
							transformOrigin={{ vertical: 'top', horizontal: 'right', }}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<MenuItem key="admin" component={Link} to="/">
								<Typography textAlign="center">Դիտել կայքը</Typography>
							</MenuItem>
							<MenuItem key="logout" onClick={logOutUser}>
								<Typography textAlign="center">Ելք</Typography>
							</MenuItem>
						</Menu>
					</Box>

				</Toolbar>
				
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant="permanent"
				anchor="left"
			>
				<Toolbar style={{background: '#1976d2', color: '#fff' }}>
						<Typography variant="h6" noWrap component="div">
								Վահանակ
						</Typography>
				</Toolbar>
				<Divider />
				<List>
					{menuLinks.map(
                        ({ title, slug, icon, caps }) => chackMenuAccess(caps) ? (
							<ListItem component={Link} to={slug} button key={slug} >
								<ListItemIcon> {icon} </ListItemIcon>
								<ListItemText primary={title} />
							</ListItem>
					    ) : null
                    )}
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }} >
				<Toolbar />
				{children}
			</Box>
		</Box>
    </SnackbarProvider>
	);
}
