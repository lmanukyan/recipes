import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


import api from "../../../services/api";
import { SiteRolesArray } from "../../../services/api/helper";


export default function EditUser() {
    let { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const user = useSelector((state) => state.user);
    const history = useHistory();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [editUser, setEditUser] = useState({
        name: '',
        email: '',
        role: 'editor',
        newPassword: '',
    });


    const loadUser = async () => {
        try{
            const { data } = await api.users.getById(id);
            setEditUser(data);
            setIsLoaded(true);
        } catch(e){
            history.push('/admin/not-found');
        }
    }

    const saveUser = async () => {
        setFetching(true);
        try{
            const { data } = await api.users.update(editUser.id, {
                ...editUser,
                password: editUser.newPassword
            });
            enqueueSnackbar('Հաջողությամբ փոփոխվեց', { variant: 'success' });
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
        setEditUser({ ...editUser, newPassword: '' })
    }

    const createUser = async () => {
        setFetching(true);
        try{
            const { data } = await api.users.create({
                ...editUser,
                password: editUser.newPassword
            });
            enqueueSnackbar('Հաջողությամբ ավելացվեց', { variant: 'success' });
            history.push(`/admin/users/${data.id}`);
        } catch(e){
            errorHandler(e);
        }
        setFetching(false);
    }

    const changeProp = (e, prop) => {
        setEditUser({
            ...editUser,
            [prop]: e.target.value
        })
    }

    const errorHandler = (e) => {
        let errorMessages = e.response.data.message;
        errorMessages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
        errorMessages.map(message => enqueueSnackbar(message, { variant: 'error' }));
    }

    useEffect(() => {
        if(id !== 'add'){
            loadUser();
        }else{
            if(!user.isAdmin){
                history.push('/admin/not-found');
            }
            setIsLoaded(true);
        }
    }, [id, user])


	return isLoaded ? (
		<Container>
			<Grid container direction="row" spacing={4} alignItems="start">

                <Grid item container xs={8} spacing={4}>
                    
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <FormLabel component="label" error={false}>Անուն</FormLabel>
                          <TextField
                            value={editUser.name}
                            type="text"
                            variant="standard"
                            onChange={(e) => changeProp(e, 'name')}
                          />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                          <FormLabel component="label" error={false}>Email</FormLabel>
                          <TextField
                            value={editUser.email}
                            type="email"
                            disabled={id !== 'add'}
                            variant="standard"
                            onChange={(e) => changeProp(e, 'email')}
                          />
                        </FormControl>
                    </Grid>

                    { user.isAdmin ? (
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Դեր</InputLabel>
                                <Select
                                    label="Դեր"
                                    value={editUser.role}
                                    onChange={(e) => changeProp(e, 'role')}
                                >
                                    {SiteRolesArray.map(({id, label}) => <MenuItem key={id} value={id}>{label}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    ) : null }

                    
                    <Grid item xs={12}>
                        <FormControl component="fieldset" fullWidth={true}>
                        <FormLabel component="label" error={false}>Նոր Գաղտնաբառ</FormLabel>
                        <TextField
                            autoComplete="off"
                            value={editUser.newPassword}
                            type={showPassword ? 'text' : 'password'}
                            variant="standard"
                            onChange={(e) => changeProp(e, 'newPassword')}
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={(e) => setShowPassword(!showPassword)}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                            }}
                        />
                        </FormControl>
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
                                onClick={createUser}
                            >
                                Ստեղծել
                            </LoadingButton>
                        ) : (
                            <LoadingButton
                                loading={fetching}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                onClick={saveUser}
                            >
                                Պահպանել
                            </LoadingButton>
                        )}
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
