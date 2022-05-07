import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { logIn } from '../../slice/userSlice';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
  
import api from "../../services/api";
import validationSchema from "./validation";


export default function Registration() {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const [responseType, setResponseType] = useState('info');

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (formData) => {
		setIsLoading(true);
		try {
			const { data } = await api.auth.register(formData);
			localStorage.setItem('accessToken', data.accessToken);
			dispatch(logIn(data));
		} catch (e) {
			errorHandler(e);
		}
		setIsLoading(false);
	};

	const errorHandler = (e) => {
		let errorMessage = e.response.data.message;
		setMessages(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
		setResponseType('error');
	}

	return (
		<Container maxWidth="xs">
			<Grid container spacing={3}>
				<Grid item xs={12}>
				<Typography variant="h4">Գրանցվել</Typography>
				</Grid>
			</Grid>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						{messages ? messages.map(text => <Alert severity={responseType} key={text} style={{ marginTop: 20 }}>{text}</Alert> ) : null}
					</Grid>
					<Grid item xs={12}>
						<Controller
						name="name"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<FormControl component="fieldset" fullWidth={true}>
							<FormLabel component="label" error={Boolean(errors.name?.message)}>Անուն</FormLabel>
							<TextField
								{...field}
								type="text"
								error={Boolean(errors.name?.message)}
								variant="standard"
							/>
							<FormHelperText error={Boolean(errors.name?.message)}>{errors.name?.message}</FormHelperText>
							</FormControl>
						)}
						/>
					</Grid>

					<Grid item xs={12}>
						<Controller
						name="email"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<FormControl component="fieldset" fullWidth={true}>
							<FormLabel component="label" error={Boolean(errors.email?.message)}>Email</FormLabel>
							<TextField
								{...field}
								type="email"
								error={Boolean(errors.email?.message)}
								variant="standard"
							/>
							<FormHelperText error={Boolean(errors.email?.message)}>{errors.email?.message}</FormHelperText>
							</FormControl>
						)}
						/>
					</Grid>

					<Grid item xs={12}>
						<Controller
						name="password"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<FormControl component="fieldset" fullWidth={true}>
							<FormLabel component="label" error={Boolean(errors.password?.message)}>Գաղտնաբառ</FormLabel>
							<TextField
								{...field}
								type="password"
								error={Boolean(errors.password?.message)}
								variant="standard"
							/>
							<FormHelperText error={Boolean(errors.password?.message)}>{errors.password?.message}</FormHelperText>
							</FormControl>
						)}
						/>
					</Grid>
					<Grid item xs={12}>
						<LoadingButton
						type="submit"
						color="primary"
						disabled={isLoading}
						loading={isLoading}
						variant="contained"
						>
						Գրանցվել
						</LoadingButton>
					</Grid>
					<Grid item container direction="row" justifyContent="space-between" spacing={3} style={{ paddingTop: 40 }}>
						<Grid item>
							<Button
								variant="outlined"
								style={{textTransform: 'none'}}
								component={Link}
								to="/reset-password"
							>
								Վերականգնել գաղտնաբառը
							</Button>
						</Grid>
						<Grid item>
							<Button
								variant="outlined"
								style={{textTransform: 'none'}}
								component={Link}
								to="/login"
							>
								Մուտք
							</Button>
						</Grid>
					</Grid>
				
				</Grid>
			</form>
		</Container>
	);
}
