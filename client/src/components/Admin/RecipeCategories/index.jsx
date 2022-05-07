import { useEffect, useState, memo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import api from "../../../services/api";

function RecipeCategories({ recipeCategories, setRecipeCategories }){

    console.log('Render: RecipeCategoriesSection');

    const [categories, setCategories] = useState([]);

    const loadCategories = async () => {
        const { data } = await api.categories.getAll({limit: 0});
        setCategories(data.categories);
    }

    const hasCategory = (id) => {
        return !! recipeCategories.filter(c => c.id == id).length;
    }

    const handleCategory = (category, e) => {
        let localCategories = recipeCategories; 
        if(e.target.checked){
            localCategories.push(category)
        }else{
            localCategories = recipeCategories.filter(c => c.id !== category.id)
        }
        setRecipeCategories([...localCategories]);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return categories.map(category => ( 
        <FormControlLabel
            key={category.id}
            label={category.title}
            control={<Checkbox checked={hasCategory(category.id)} onChange={(e) => handleCategory(category, e)} />}
        />
    ))
}

export default memo(RecipeCategories);