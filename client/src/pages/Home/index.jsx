import { useEffect, useState, useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Intro from '../../components/Intro';
import Recipe from '../../components/Recipe';


import api from "../../services/api";

export default function Home() {
	let { slug } = useParams();
	let history = useHistory();
	const [recipes, setRecipes] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(0);
	const [filters, setFilters] = useState({
		ingredients: [],
		category: '',
	});

	const loadRecipes = async (append = false) => {
		console.log(recipes.length);
		setLoading(true);
        const { data } = await api.recipes.getAll({ 
			sort: {createdAt: -1, title: 1},
			skip: append ? recipes.length : 0,
			limit: 15,
			filters: makeFilters()
		});
		if(append){
			setRecipes([
				...recipes,
				...data.recipes
			]);
		}else{
			setRecipes(data.recipes);
		}
		setCount(data.count);
		setLoading(false);
    }

	const loadIngredients = async () => {
        const { data } = await api.ingredients.getAll({ limit: 0 });
        setIngredients(data.ingredients);
    }

	const loadCategories = async () => {
        const { data } = await api.categories.getAll({ limit: 0 });
        setCategories(data.categories);
    }

	const addIngredient = (item) => {
		if(!item) return;
		setFilters({
			...filters,
			ingredients: [
				...filters.ingredients,
				item
			]
		});
	}

	const removeIngredient = (id) => {
		let filterIngredints = filters.ingredients.filter(i => i.id !== id);
		setFilters({
			...filters,
			ingredients: filterIngredints
		});
	}

	const selectCategory = ({ target }) => {
		setFilters({
			...filters,
			category: target.value
		});
	}

	const makeFilters = () => {
		let $and = [];
		if(filters.ingredients.length !== 0){
			for(let ingredient of filters.ingredients){
				$and.push({
					"ingredients.type": "ingredient",
					"ingredients.value": ingredient.id
				})
			}
		}

		if(filters.category !== ''){
			$and.push({
				"categories": { $in: filters.category }
			})
		}
		
		$and.push({"status": "publish"});

		return {
			$and: $and
		};
	}

	const loadSingleCategory = async () => {
		try {
			const { data } = await api.categories.getBySlug(slug);
			setFilters({
				...filters,
				category: data
			});
			document.title = data.title;
		} catch(e){
			history.push('/not-found');
		}
	}

	const getFilterIngrediants = () => {
		let selecteds = filters.ingredients.map(i => i.id);
		return ingredients.filter(i => ! selecteds.includes(i.id) );
	}

	const isCategoryPage = useMemo(() => {
		if(slug === '' || typeof slug === 'undefined'){
			return false;
		}
		return true;
	}, [slug])

	useEffect(() => {
		if( ! isCategoryPage ){
			loadRecipes();
			loadCategories();
		} else {
			loadSingleCategory();
		}
        loadIngredients();
    }, [slug]);

	useEffect(() => {
		if( isCategoryPage && filters.category !== ''){
			loadRecipes();
		}
    }, [filters.category, slug]);

	const IngredinetsChips = useCallback(() => {
		return filters.ingredients.map(ingredient => (
			<li key={ingredient.id} style={{margin: 5}}>
				<Chip label={ingredient.title} onDelete={() => removeIngredient(ingredient.id)} />
			</li>
		))
	}, [filters.ingredients]) 

	return (
	<>
		<Intro category={isCategoryPage ? filters.category : null} />
		
		<Grid container style={{padding: 32}} spacing={2} sx={{ flexFlow: { sm: 'column-reverse', lg: 'row' } }}>

			<Grid item container lg={9} sm={12} spacing={2}>

				{ recipes.length > 0 ? (
					<Grid item container spacing={2}>
						{recipes.map(recipe => <Recipe key={recipe.id} {...recipe} />)}
					</Grid>
				) : (
					<Grid item container alignItems="center" justifyContent="center">
						{ ! loading && <Typography>Չի գտնվել</Typography> }
					</Grid>
				) }

				<Grid item container justifyContent="center">
					{ loading && <CircularProgress color="inherit" /> }
                    { ! loading && count > recipes.length && <Button variant="contained" onClick={() => loadRecipes(true)}>Ավելին</Button> }
				</Grid>
			</Grid>
			
			<Grid item container lg={3} sm={12} spacing={4} direction="column">
				
				{ ! isCategoryPage ? (
					<Grid item>
						<FormControl fullWidth>
							<InputLabel>Կատեգորիաներ</InputLabel>
							<Select
								fullWidth
								value={filters.category}
								label="Կատեգորիաներ"
								onChange={selectCategory}
							>	
								<MenuItem key="none" value="">---</MenuItem>
								{categories.map(category => <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
				) : null }

				<Grid item>
					<FormControl fullWidth>
						<Autocomplete
							fullWidth
							value={null}
							blurOnSelect
							disablePortal={false}
							options={getFilterIngrediants()}
							getOptionLabel={(option) => option.title}
							onChange={(event, value) => addIngredient(value)}
							renderOption={(props, option) => <li {...props} key={option.id}>{option.title}</li> }
							renderInput={(params) => <TextField {...params} label="Բաղադրիչներ" />}
						/>
					</FormControl>

					<Paper
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							listStyle: 'none',
							boxShadow: 'none',
							p: 0.5,
							m: 0,
						}}
						component="ul"
					>
						<IngredinetsChips />
					</Paper>
				</Grid>
				
				<Grid item container justifyContent="center" style={{paddingTop: 32}}>
					<LoadingButton 
						variant="contained" 
						onClick={() => loadRecipes(false)}
						disabled={loading}
					>
						Փնտրել
					</LoadingButton>
				</Grid>


			</Grid>
		</Grid>

	</>
	);
}