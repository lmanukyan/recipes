import { Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux'

import MainLayout from "../../../layouts/MainLayout/";

export default function PrivateRoute({ children, layout: Layout = MainLayout, ...rest }) {
	const user = useSelector((state) => state.user);

	let hasAccess = ! rest.hasOwnProperty('caps') ? true : rest?.caps.includes(user.meta.role);

	console.log(user, hasAccess);

	return (
		<Route
			{...rest}
			render={({ location }) => {
				const url = new URLSearchParams();
				url.set("redirect", location.pathname + location.search);

				return hasAccess ? (
					user.isLoggedIn ? (
						<Layout {...rest} >
							{children}
						</Layout>
					) : (
						<Redirect
							to={{
								pathname: "/login",
								search: url.toString(),
							}}
						/>
					)
				) : <Redirect to={{ pathname: "/not-found" }} />
			}}
		/>
	);
}
