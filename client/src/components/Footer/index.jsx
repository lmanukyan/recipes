import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import api from '../../services/api';

const useStyles = makeStyles(theme => ({
	AppBar: {
		background: "#ededed",
		color: "#000000",
	},
	copyRight: {
		padding: 15
	},
	categoriesMenu: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: 15,
		background: '#161616',
		color: '#ccc'
	},
}));



function Footer() {
	const classes = useStyles();	

	const [categories, setCategories] = useState([]);

	const loadCategories = async () => {
        const { data } = await api.categories.getAll({
            limit: 0
        });
        setCategories(data.categories);
    }

	useEffect(() => {
		loadCategories();
	}, [])

	return (
	    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className={classes.AppBar}>
	    	
			<Grid container
	    	  alignItems="center"
	    	  spacing={3}
	    	>

				<Grid item xs={12}>
					<div className={classes.categoriesMenu}>
						{categories.map(category => <Link key={category.id} to={`/category/${category.slug}`} onClick={() => window.scrollTo(0, 0)}>{category.title}</Link>)}
					</div>
				</Grid>
				<Grid item xs={12} style={{paddingTop: 0}}>
					<div className={classes.copyRight}>
	    				<Typography variant="subtitle2" align="center">© 2022. Բաղադրատոմսերը վերցված են <a href="https://xohanoc.info" target="_blank">xohanoc.info</a> կայքից։ Բոլոր իրավունքները պաշտպանված են․</Typography>
					</div>
	    		</Grid>
			
	    	</Grid>
	    </AppBar>
	);
}

export default memo(Footer);
