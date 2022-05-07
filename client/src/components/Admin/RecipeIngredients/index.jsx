import { useEffect, useState, useCallback, memo } from 'react';
import { Container, Draggable } from "react-smooth-dnd";
import { arrayMoveImmutable } from "array-move";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import RecipeIngredientsModal from '../RecipeIngredientsModal';
import api from "../../../services/api";

const lineOptions = [
    {key: 'Բաղադրիչ', value: 'ingredient'},
    {key: 'Հատուկ', value: 'specific'},
    {key: 'Վերնագիր', value: 'section'}
];

function RecipeIngredients({ recipeIngredients, setRecipeIngredients }){

    console.log('Render: RecipeIngredient');

    const [ingredients, setIngredients] = useState([]);    
    const [modalOpened, setModalOpened] = useState(false);
    const [activeIngredientIndex, setActiveIngredientIndex] = useState(0);
    const [modalSelectedIngredient, setModalSelectedIngredient] = useState(null);

    const loadIngredients = async () => {
        const { data } = await api.ingredients.getAll({limit: 0});
        setIngredients(data.ingredients);
    }

    const addNewIngredient = () => {
        setRecipeIngredients([
            ...recipeIngredients,
            { type: 'specific', value: '', count: '' }
        ])
    }

    const updateIngredient = ({ index, key, value }) => {
        console.log(recipeIngredients);
        recipeIngredients[index][key] = value;
        setRecipeIngredients([...recipeIngredients]);
    }

    const removeIngredient = (index) => {
        recipeIngredients = recipeIngredients.filter((p, i) => i !== index);
        setRecipeIngredients(recipeIngredients);
    }

    const setType = (e, index) => {
        updateIngredient({
            index: index,
            key: 'type',
            value: e.target.value
        })
    }

    const setCount = (e, index) => {
        updateIngredient({
            index: index,
            key: 'count',
            value: e.target.value
        })
    }

    const setValue = (e, index) => {
        updateIngredient({
            index: index,
            key: 'value',
            value: e.target.value
        })
    }

    const changeIngredient = (e, type, index) => {
        if(type !== 'ingredient') return;
        setActiveIngredientIndex(index);
        setModalOpened(true);
        e.target.focus = false;
    }

    const getTitle = useCallback((item) => {
        if(item.type !== 'ingredient') return item.value;
        let ingredient = ingredients.filter(i => i.id == item.value);
        return ingredient.length ? ingredient[0].title : '';
    }, [ingredients]);

    const onDrop = ({ removedIndex, addedIndex }) => {
        setRecipeIngredients(recipeIngredients => arrayMoveImmutable(recipeIngredients, removedIndex, addedIndex));
    };

    useEffect(() => {
        if(modalSelectedIngredient && activeIngredientIndex !== null){
            updateIngredient({
                index: activeIngredientIndex,
                key: 'value',
                value: modalSelectedIngredient.id
            })
        }
    }, [modalSelectedIngredient, activeIngredientIndex]);

    useEffect(() => {
        loadIngredients();
    }, []);

    return (
        
        <>
            <Typography variant="h6">Բաղադրիչներ</Typography>

            <Grid item container style={{paddingBottom: 10, paddingLeft: 0, textAlign: 'center'}}>
                <Grid item xs={1}></Grid>
                <Grid item xs={3}>Տեսակ</Grid>
                <Grid item xs={4}>Արժեք</Grid>
                <Grid item xs={3}>Քանակ</Grid>
                <Grid item xs={1}></Grid>
            </Grid>

            <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
            {
                recipeIngredients.map((item, index) => (
                <Draggable key={index}>
                    <Grid container spacing={2} alignItems="center" style={{marginBottom: 10}}>
                        <Grid item xs={1}>
                            <DragHandleIcon className="drag-handle" />
                        </Grid>
                        <Grid item xs={3}>
                            <Select onChange={(e) => setType(e, index)} value={item.type} fullWidth>
                                {lineOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.key}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField value={getTitle(item)} onChange={(e) => setValue(e, index)}  onFocus={(e) => changeIngredient(e, item.type, index)} fullWidth />
                        </Grid>
                        <Grid item xs={3}>
                            {item.type !== 'section' ? <TextField defaultValue={item.count} onChange={(e) => setCount(e, index)} fullWidth /> : null}
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="error" onClick={() => removeIngredient(index)} component="span">
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Draggable>
                ))
            }
            </Container>

            <Grid item container spacing={2}>
                <Grid item xs={1}>
                <Button variant="contained" onClick={addNewIngredient} startIcon={<AddIcon />}>Նոր</Button>
                </Grid>
            </Grid>
            
            <RecipeIngredientsModal 
                ingredients={ingredients} 
                modalOpened={modalOpened} 
                setModalOpened={setModalOpened} 
                setModalSelectedIngredient={setModalSelectedIngredient}
            />
        </>
    )
}

export default memo(RecipeIngredients);