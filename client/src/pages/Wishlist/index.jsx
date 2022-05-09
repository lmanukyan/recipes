import { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Recipe from '../../components/Recipe';
import ObjectStorage from '../../services/objectStorage';
import api from "../../services/api";

export default function Wishlist() {

	const [recipes, setRecipes] = useState([]); 

	const loadRecipes = async () => {
		try {
			const { data } = await api.recipes.getAll({
				filters: {
					_id: {
						$in: Array.from( ObjectStorage.get('recipes_wishlist') )
					}
				}
			});
			setRecipes(data.recipes);
		} catch(e) {
			console.log(e);
		}
    }

	useEffect(() => {
		loadRecipes();
	}, [])

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" align="center" style={{marginBottom: 10}}>Wishlist</Typography>
			</Grid>
			<Grid item container spacing={2} xs={12} style={{padding: 32}}>
				{recipes.map(recipe => <Recipe key={recipe.id} {...recipe} gridCol={3} />)}
			</Grid>
		</Grid>
	);
}
