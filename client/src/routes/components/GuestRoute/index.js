import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux'

import MainLayout from "../../../layouts/MainLayout/";

export default function GuestRoute({ children, layout: Layout = MainLayout, ...rest }) {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const history = useHistory();

	return (
		<Route
			{...rest}
			render={() => {
				const url = new URLSearchParams(history.location.search.slice(1));

				return isLoggedIn ? (
					<Redirect to={url.get("redirect") || "/"} />
				) : (
					<Layout {...rest} >
						{children}
					</Layout>
				);
			}}
		/>
	);
}
