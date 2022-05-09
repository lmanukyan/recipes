import { useEffect, useState, useRef, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';


import TextEditor from '../../../components/Admin/TextEditor';

import api from "../../../services/api";


export default function EditCategory() {
    let { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const user = useSelector((state) => state.user);

    const [isLoaded, setIsLoaded] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [category, setCategory] = useState({
        title: '',
        slug: '',
        description: '',
        author: null
    });


    const loadCategory = async () => {
        try{
            const { data } = await api.categories.getById(id);
            setCategory(data);
            setIsLoaded(true);
        } catch(e){
            history.push('/admin/not-found');
        }
    }

    const saveCategory = async () => {
        setFetching(true);
        try{
            const { data } = await api.categories.update(category.id, transformForUpdateOrSave(category));
            enqueueSnackbar('Հաջողությամբ փոփոխվեց', { variant: 'success' });
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const createCategory = async () => {
        setFetching(true);
        try{
            const { data } = await api.categories.create(transformForUpdateOrSave(category));
            enqueueSnackbar('Հաջողությամբ ավելացվեց', { variant: 'success' });
            history.push(`/admin/categories/${data._id}`);
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const deleteCategory = async () => {
        if( window.confirm(`Ջնջել <${category.title}> կատեգորիան ?`) ){
            try{
                await api.categories.delete(id);
                enqueueSnackbar('Հաջողությամբ ջնջվեց', { variant: 'success' });
                history.push(`/admin/categories`);
            } catch(e){
                errorHandler(e);
            }
        }
    }

    const changeProp = (e, prop) => {
        setCategory({
            ...category,
            [prop]: e.target.value
        })
    }

    const transformForUpdateOrSave = (category) => {
        return {
            ...category,
            description: window.tinymce.activeEditor.getContent()
        }
    }

    const canDelete = useMemo(() => {
        return id !== 'add' && ( user.isAdmin || user.meta.id == category.author?.id );
    }, [id, user, category.author]);

    const errorHandler = (e) => {
        let errorMessages = e.response.data.message;
        errorMessages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
        errorMessages.map(message => enqueueSnackbar(message, { variant: 'error' }));
    }

    useEffect(() => {
        if(id !== 'add'){
            loadCategory();
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
                            value={category.title}
                            type="text"
                            variant="standard"
                            onChange={(e) => changeProp(e, 'title')}
                          />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <FormLabel component="label" error={false}>Լինկ</FormLabel>
                          <TextField
                            value={decodeURIComponent(category.slug)}
                            type="text"
                            variant="standard"
                            onChange={(e) => changeProp(e, 'slug')}
                          />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <FormLabel component="label" error={false}>Նկարագրություն</FormLabel>
                          <TextEditor value={category.description} />
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
                                    onClick={createCategory}
                                >
                                    Ստեղծել
                                </LoadingButton>
                            ) : (
                                <LoadingButton
                                    loading={fetching}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    onClick={saveCategory}
                                >
                                    Պահպանել
                                </LoadingButton>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            { canDelete && <Button onClick={deleteCategory} variant="outlined" startIcon={<DeleteIcon />} color="error">Ջնջել</Button> }
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
