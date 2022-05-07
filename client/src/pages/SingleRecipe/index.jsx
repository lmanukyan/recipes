import { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';


import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
		let ingredientLabel = ingredient.value;
		if(ingredient.type === 'ingredient'){
			ingredientLabel = labels[ingredient.value];
		};
		return ucfirst(ingredientLabel);
	}

	const ucfirst = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const IngredientsList = useCallback(() => {
		if(!recipe?.ingredients) return null;
		return recipe?.ingredients.map((ingredient, index) => (
			<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
				<TableCell component="th" scope="row">{getIngredientLabel(ingredient)}</TableCell>
				<TableCell align="right">{ingredient.count}</TableCell>
			</TableRow>
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
					<Typography variant="h5" style={{paddingBottom: 10}}>Բաղադրիչները</Typography>

					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} size="small">
							<TableHead>
								<TableRow>
									<TableCell>Բաղադրիչը</TableCell>
									<TableCell align="right">Քանակը</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<IngredientsList />
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</Container>
	);
}