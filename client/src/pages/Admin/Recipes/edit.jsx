import { useEffect, useCallback, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/system';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import MediaUploader from '../../../components/Admin/MediaUploader';
import TextEditor from '../../../components/Admin/TextEditor';
import RecipeCategories from '../../../components/Admin/RecipeCategories';
import RecipeIngredients from '../../../components/Admin/RecipeIngredients';

import api from "../../../services/api";

const FieldLabel = styled(Typography)({
	marginBottom: 6
});

export default function EditRecipe() {

    console.log("Render: EditRecipe");

    let { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const history = useHistory();
    
    const [recipeId, setRecipeId] = useState(null);
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeSlug, setRecipeSlug] = useState('');
    const [recipeStatus, setRecipeStatus] = useState('draft');
    const [recipeThumbnail, setRecipeThumbnail] = useState(null);
    const [recipeInstructions, setRecipeInstructions] = useState('');
    const [recipeCategories, setRecipeCategories] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    
    const [fetching, setFetching] = useState(false);
    const [isRecipeLoaded, setRecipeLoaded] = useState(false);
    const [mediaUploaderOpened, setMediaUploaderOpened] = useState(false);

    const loadRecipe = async () => {
        try{
            const { data } = await api.recipes.getById(id);
            setRecipeId(data.id);
            setRecipeTitle(data.title);
            setRecipeSlug(data.slug);
            setRecipeStatus(data.status);
            setRecipeThumbnail(data.thumbnail);
            setRecipeInstructions(data.instructions);
            setRecipeCategories(data.categories);
            setRecipeIngredients(data.ingredients);
            setRecipeLoaded(true);
        } catch(e){
            history.push('/admin/not-found');
        }
    }

    const saveRecipe = async () => {
        setFetching(true);
        try{
            const { data } = await api.recipes.update(recipeId, getRecipeData());
            enqueueSnackbar('Հաջողությամբ պահպանվեց', { variant: 'success' });
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const createRecipe = async () => {
        setFetching(true);
        try{
            const { data } = await api.recipes.create(getRecipeData());
            enqueueSnackbar('Հաջողությամբ ավելացվեց', { variant: 'success' });
            history.push(`/admin/recipes/${data.id}`);
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const selectImage = (item) => {
        setMediaUploaderOpened(false);
        setRecipeThumbnail(item);
    }

    const removeRecipeImage = () => {
        setRecipeThumbnail(null);
    }

    const getRecipeData = () => {
        return {
            title: recipeTitle,
            slug: recipeSlug,
            status: recipeStatus,
            thumbnail: recipeThumbnail ? recipeThumbnail.id : null,
            categories: recipeCategories.map(category => category.id),
            ingredients: recipeIngredients,
            instructions: window.tinymce.activeEditor.getContent()
        }
    }

    const errorHandler = (e) => {
        let errorMessages = e.response.data.message;
        errorMessages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
        errorMessages.map(message => enqueueSnackbar(message, { variant: 'error' }));
    }

    useEffect(() => {
        if(id !== 'add'){
            loadRecipe();
        }else{
            setRecipeLoaded(true);
        }
    }, [id])

    const MediaUploaderModal = useCallback(() => (
        <Dialog open={mediaUploaderOpened} onClose={() => setMediaUploaderOpened(false)} fullWidth={true} maxWidth={false}>
            <MediaUploader setRecipeThumbnail={setRecipeThumbnail} setMediaUploaderOpened={setMediaUploaderOpened} />
            <IconButton onClick={() => setMediaUploaderOpened(false)} sx={{ position: 'fixed', right: 2, top: 2, color: '#fff' }}>
                <CloseIcon />
            </IconButton>
        </Dialog>
    ), [mediaUploaderOpened]);

	return isRecipeLoaded ? (
		<Container>
			<Grid container direction="row" spacing={4} alignItems="start">

                <Grid item container xs={8} spacing={4}>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <Typography variant="h6">Անվանումը</Typography>
                          <TextField
                            value={recipeTitle}
                            type="text"
                            variant="standard"
                            onChange={(e) => setRecipeTitle(e.target.value)}
                          />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <Typography variant="h6">Լինկ</Typography>
                          <TextField
                            value={decodeURIComponent(recipeSlug)}
                            type="text"
                            variant="standard"
                            onChange={(e) => setRecipeSlug(e.target.value)}
                          />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FieldLabel variant="h6">Պատրաստման եղանակը</FieldLabel>
                            <TextEditor value={recipeInstructions} />
                        </FormControl>
                    </Grid>

                    <Grid item container xs={12} spacing={2}>
                        <RecipeIngredients recipeIngredients={recipeIngredients} setRecipeIngredients={setRecipeIngredients} />
                    </Grid>

                </Grid>

                <Grid item container xs={4} spacing={4}>

                    <Grid item xs={12}>
                        {id === 'add' ? (
                            <LoadingButton
                                loading={fetching}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                onClick={createRecipe}
                            >
                                Ստեղծել
                            </LoadingButton>
                        ) : (
                            <LoadingButton
                                loading={fetching}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                onClick={saveRecipe}
                            >
                                Պահպանել
                            </LoadingButton>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FieldLabel variant="h6">Վիճակը</FieldLabel>
                            <Select value={recipeStatus} onChange={(e) => setRecipeStatus(e.target.value)}>
                                <MenuItem value="publish">Հրապարակված</MenuItem>
                                <MenuItem value="draft">Չհրապարակված</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FieldLabel variant="h6">Կատեգորիաներ</FieldLabel>
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                <RecipeCategories recipeCategories={recipeCategories} setRecipeCategories={setRecipeCategories} />
                            </Box>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FieldLabel variant="h6">Նկար</FieldLabel>
                            <Card sx={{ maxWidth: 345 }}>
                                {recipeThumbnail ? (
                                    <CardMedia
                                		component="img"
                                		style={{minHeight: 250}}
                                		image={process.env.REACT_APP_DOMAIN_URL + recipeThumbnail.path}
                                	/>
                                ) : (
                                    <Skeleton
                                        variant="rectangular"
                                        width={345}
                                        height={250}
                                    />
                                )}
                            	<CardActions>
                                    {recipeThumbnail ? (<>
                                        <Button size="small" onClick={() => setMediaUploaderOpened(true)}>Փոխել</Button>
                                        <Button size="small" onClick={removeRecipeImage}>Հեռացնել</Button>
                                    </>) : (
                                        <Button size="small" onClick={() => setMediaUploaderOpened(true)}>Ընտրել</Button>
                                    )}
                            	</CardActions>
                            </Card>

                        </FormControl>
                    </Grid>

                </Grid>

			</Grid>

            <MediaUploaderModal />

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
