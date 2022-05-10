import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	isLoggedIn: false,
	isLoaded: false,
	isAdmin: false,
	meta: { id: null, name: null, email: null, role: null }, 
}

export const userSlice = createSlice({
	name: 'user',
	initialState: {...initialState},
	reducers: {
		setIsLoggedIn: (state, { payload }) => {
			state.isLoggedIn = payload
		},
		setIsLoaded: (state, { payload }) => {
			state.isLoaded	= payload
		},
		logOut: (state) => {
			state = initialState;
		},
		logIn: (state, { payload }) => {
			state.isLoggedIn = true;
			state.meta = payload;
			state.isAdmin = ['administrator', 'moderator'].includes(payload.role) ? true : false;
		}
	},
})

export const {
	setIsLoggedIn,
	setIsLoaded,
	setMeta,
	logOut,
	logIn
} = userSlice.actions

export default userSlice.reducer
