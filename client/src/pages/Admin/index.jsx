import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import api from "../../services/api";

function Admin() {

	const [recipes, setRecipes] = useState([]);
	
	const loadRecipes = async () => {
		const { data } = await api.recipes.getAll({
            limit: 5,
			sort: {createdAt: -1}
        });
        setRecipes(data.recipes);
	}

	useEffect(() => {
		loadRecipes();
	}, []);

	return (
		<Container>
		<Grid container spacing={4}>
			<Grid item md={8}>

				<Grid item>
					<Typography variant="h6" gutterBottom>Վերջին ավելացված բաղադրատոմսերը</Typography>
					<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
						{recipes.map(recipe => (
							<ListItemButton alignItems="flex-start" component={Link} to={`/recipe/${recipe.slug}`} key={recipe.id}>
								<ListItemAvatar>
									<Avatar alt="Remy Sharp" src={process.env.REACT_APP_DOMAIN_URL + recipe.thumbnail.path} />
								</ListItemAvatar>
								<ListItemText
									primary={recipe.title}
									secondary={`Հեղինակ։ ${recipe.author?.name}`}
								/>
							</ListItemButton>
						) )}
					</List>
				</Grid>

			</Grid>
		</Grid>
		</Container>
	);
}

export default Admin;
