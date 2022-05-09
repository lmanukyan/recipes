import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';


import api from "../../../services/api";


export default function EditIngredient() {
    let { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const user = useSelector((state) => state.user);

    const [isLoaded, setIsLoaded] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [ingredient, setIngredient] = useState({
        title: '',
    });


    const loadIngredient = async () => {
        try{
            const { data } = await api.ingredients.getById(id);
            setIngredient(data);
            setIsLoaded(true);
        } catch(e){
            history.push('/admin/not-found');
        }
    }

    const saveIngredient = async () => {
        setFetching(true);
        try{
            const { data } = await api.ingredients.update(ingredient.id, ingredient);
            enqueueSnackbar('Կատեգորիան հաջողությամբ փոփոխվեց', { variant: 'success' });
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const createIngredient = async () => {
        setFetching(true);
        try{
            const { data } = await api.ingredients.create(ingredient);
            enqueueSnackbar('Հաջողությամբ ավելացվեց', { variant: 'success' });
            history.push(`/admin/ingredients/${data._id}`);
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const deleteIngredient = async () => {
        if( window.confirm(`Ջնջել <${ingredient.title}> բաղադրիչը ?`) ){
            try{
                await api.ingredients.delete(id);
                enqueueSnackbar('Հաջողությամբ ջնջվեց', { variant: 'success' });
                history.push(`/admin/ingredients`);
            } catch(e){
                errorHandler(e);
            }
        }
    }

    const changeProp = (e, prop) => {
        setIngredient({
            ...ingredient,
            [prop]: e.target.value
        })
    }

    const canDelete = useMemo(() => {
        return id !== 'add' && ( user.isAdmin || user.meta.id == ingredient.author?.id );
    }, [id, user, ingredient.author]);

    const errorHandler = (e) => {
        let errorMessages = e.response.data.message;
        errorMessages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
        errorMessages.map(message => enqueueSnackbar(message, { variant: 'error' }));
    }

    useEffect(() => {
        if(id !== 'add'){
            loadIngredient();
        }else{
            setIsLoaded(true);
        }
    }, [id])


	return isLoaded ? (
		<Container>
			<Grid container direction="row" spacing={4} alignItems="start">

                <Grid item container xs={8} spacing={4}>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <FormLabel component="label" error={false}>Անվանումը</FormLabel>
                          <TextField
                            value={ingredient.title}
                            type="text"
                            variant="standard"
                            onChange={(e) => changeProp(e, 'title')}
                          />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item container xs={4} spacing={4}>

                    <Grid item container xs={12}>
                        <Grid item xs={6}>
                            {id === 'add' ? (
                                <LoadingButton
                                    loading={fetching}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    onClick={createIngredient}
                                >
                                    Ստեղծել
                                </LoadingButton>
                            ) : (
                                <LoadingButton
                                    loading={fetching}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    onClick={saveIngredient}
                                >
                                    Պահպանել
                                </LoadingButton>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            { canDelete && <Button onClick={deleteIngredient} variant="outlined" startIcon={<DeleteIcon />} color="error">Ջնջել</Button> }
                        </Grid>
                    </Grid>


                </Grid>
			</Grid>
		</Container>
	) : (
        <Container maxWidth="xs">
          <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ paddingTop: 30 }}>
            <Grid item>
              <CircularProgress color="inherit" />
            </Grid>
          </Grid>
        </Container>
    );
}
