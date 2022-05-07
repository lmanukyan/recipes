import { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import api from "../../services/api";

export default function SingleRecipe() {
	let { slug } = useParams();
	const history = useHistory();
	const [labels, setLabels] = useState({});
	const [recipe, setRecipe] = useState({});

	const loadRecipe = async () => {
        try{
            const { data } = await api.recipes.getBySlug(slug);
			await loadIngredientLabels(data.ingredient_ids);
            setRecipe(data);
            console.log(data);
        } catch(e){
            history.push('/not-found');
        }
    }

	const loadIngredientLabels = async (ids) => {
		const { data } = await api.ingredients.getLabels(ids);
        let labels = {};
		data.map(i => labels[i.id] = i.title)
		setLabels(labels);
	}

	const getIngredientLabel  = (ingredient) => {
		if(ingredient.type !== 'ingredient') return ingredient.value;
		return labels[ingredient.value];
	}

	const IngredientsList = useCallback(() => {
		if(!recipe?.ingredients) return null;
		return recipe?.ingredients.map((ingredient, index) => (
			<ListItem disablePadding key={index}>
				<ListItemButton style={{textTransform: 'capitalize', fontWeight: ingredient.type == 'section' ? 'bold' : 'normal'}}>{getIngredientLabel(ingredient)}</ListItemButton>
				<ListItemButton style={{justifyContent: 'end'}}>{ingredient.count}</ListItemButton>
			</ListItem>
		))
	}, [recipe.ingredients])

	useEffect(() => {
        loadRecipe();
    }, [])

	return (
		<Container>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h4" align="center" style={{marginBottom: 10}}>{recipe.title}</Typography>
				</Grid>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={recipe.thumbnail ? 8 : 12}>
						<Typography variant="h5">Պատրաստման եղանակը</Typography>
						<Typography dangerouslySetInnerHTML={{ __html: recipe.instructions }}></Typography>
					</Grid>
					{recipe.thumbnail ? (	
						<Grid item xs={4} container justifyContent="end">
							<img src={`http://localhost:5000/${recipe.thumbnail.path}`} style={{width: '100%', maxHeight: 300}} /> 
						</Grid>
					) : null}
				</Grid>
				
				<Grid item xs={8}>
					<Typography variant="h5">Բաղադրիչները</Typography>
					<List>
						<IngredientsList />
					</List>
				</Grid>
			</Grid>
		</Container>
	);
}