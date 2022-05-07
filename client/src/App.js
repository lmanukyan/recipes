import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logIn, setIsLoaded } from './slice/userSlice';
import { styled } from '@mui/system';

import Routes from "./routes/Routes";

import api from "./services/api";
import "./App.css";

const Wrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	height: '100%'
});

export default function App() {
	const dispatch = useDispatch();

	const loadProfile = useCallback(async () => {
		try {
			const { data } = await api.auth.getProfile();
			dispatch(logIn(data));
		} catch(e) {
		    localStorage.removeItem('accessToken');
		    console.log(e.response);
		} finally {
		    dispatch(setIsLoaded(true));
		}
	}, [dispatch]);

	useEffect(() => {
	    loadProfile();
	}, [loadProfile])

    return (
        <Wrapper>
            <Routes />
        </Wrapper>
    );
}