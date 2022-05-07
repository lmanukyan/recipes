import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

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

const useQuery = () => {
	let search = window.location.search;
	return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ChangePassword() {
	const query = useQuery();
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const [responseType, setResponseType] = useState('');

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (formData) => {
		setMessages([]);
		setIsLoading(true);
		try {
			const { data } = await api.auth.change({
				password: formData.password,
				token: query.get('token')
			});
			setResponseType('success');
			setMessages([data.message]);
			reset();
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

	useEffect(() => {
		if(query.get('token') === null){
			history.push('/not-found')
		}
	}, [query]);

	return (
		<Container maxWidth="xs">
			<Grid container spacing={3}>
				<Grid item xs={12}>
				<Typography variant="h4">Վերականգնել</Typography>
				</Grid>
		  	</Grid>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3}>
					<Grid item xs={12} style={{ marginTop: 20 }}>
						{messages ? messages.map(text => <Alert severity={responseType} key={text}>{text}</Alert> ) : null}
					</Grid>
					<Grid item xs={12}>
						<Controller
						name="password"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<FormControl component="fieldset" fullWidth={true}>
								<FormLabel component="label" error={Boolean(errors.password?.message)}>Նոր գաղտնաբառ</FormLabel>
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
						<Controller
						name="passwordConfirm"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<FormControl component="fieldset" fullWidth={true}>
								<FormLabel component="label" error={Boolean(errors.passwordConfirm?.message)}>Կրկնեք գաղտնաբառ</FormLabel>
								<TextField
								{...field}
								type="password"
								error={Boolean(errors.passwordConfirm?.message)}
								variant="standard"
								/>
								<FormHelperText error={Boolean(errors.passwordConfirm?.message)}>{errors.passwordConfirm?.message}</FormHelperText>
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
							Փոխել
						</LoadingButton>
					</Grid>
					
					<Grid item container direction="row" justifyContent="space-between" spacing={3} style={{ paddingTop: 40 }}>
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
						<Grid item>
							<Button
								variant="outlined"
								style={{textTransform: 'none'}}
								component={Link}
								to="/registration"
							>
								Գրանցվել
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</form>
						
		</Container>
	);
}
