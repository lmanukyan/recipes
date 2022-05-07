import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout/";
import AdminLayout from "../../layouts/AdminLayout/";

import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Registration from "../../pages/Registration";
import ResetPassword from "../../pages/ResetPassword";
import ChangePassword from "../../pages/ChangePassword";
import NotFound from "../../pages/NotFound";
import SingleRecipe from "../../pages/SingleRecipe";

import Admin from "../../pages/Admin";
import AdminNotFound from "../../pages/Admin/NotFound";
import Recipes from "../../pages/Admin/Recipes";
import EditRecipe from "../../pages/Admin/Recipes/edit";
import Categories from "../../pages/Admin/Categories";
import EditCategory from "../../pages/Admin/Categories/edit";
import Ingredients from "../../pages/Admin/Ingredients";
import EditIngredient from "../../pages/Admin/Ingredients/edit";
import Users from "../../pages/Admin/Users";
import EditUsers from "../../pages/Admin/Users/edit";

import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";

import MediaUploader from "../../components/Admin/MediaUploader"

import {
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";

const PublicRoute = ({ children, layout: Layout = MainLayout, ...rest }) => {
    return (
        <Route {...rest}>
            <Layout {...rest}>
              {children}
            </Layout>
        </Route>
    );
}


export default function Routes() {
	const { isLoaded } = useSelector((state) => state.user);

    return isLoaded ? (
		<Switch>
			<PublicRoute exact path="/" noPadding={true}>
				<Home />
			</PublicRoute>

			<GuestRoute path="/login">
				<Login />
			</GuestRoute>

			<GuestRoute path="/registration">
				<Registration />
			</GuestRoute>

			<GuestRoute path="/reset-password">
				<ResetPassword />
			</GuestRoute>

			<GuestRoute path="/change-password">
				<ChangePassword />
			</GuestRoute>

			<PublicRoute path="/not-found">
				<NotFound />
			</PublicRoute>

			<PublicRoute path="/recipe/:slug">
				<SingleRecipe />
			</PublicRoute>

			<PrivateRoute exact path="/admin" layout={AdminLayout} pagename="Գլխավոր">
				<Admin />
			</PrivateRoute>

			<PrivateRoute exact path="/admin/recipes" layout={AdminLayout} pagename="Բաղադրատոմսեր">
				<Recipes />
			</PrivateRoute>

			<PrivateRoute path="/admin/recipes/:id" layout={AdminLayout} pagename="Փոփոխել/ավելացնել բաղադրատոմսը">
				<EditRecipe />
			</PrivateRoute>

			<PrivateRoute exact path="/admin/categories" layout={AdminLayout} pagename="Կատեգորիաներ">
				<Categories />
			</PrivateRoute>

			<PrivateRoute path="/admin/categories/:id" layout={AdminLayout} pagename="Փոփոխել/ավելացնել կատեգորիան">
				<EditCategory />
			</PrivateRoute>

			<PrivateRoute exact path="/admin/ingredients" layout={AdminLayout} pagename="Բաղադրիչներ">
				<Ingredients />
			</PrivateRoute>

			<PrivateRoute path="/admin/ingredients/:id" layout={AdminLayout} pagename="Փոփոխել/ավելացնել բաղադրիչը">
				<EditIngredient />
			</PrivateRoute>

            <PrivateRoute exact path="/admin/users" layout={AdminLayout} pagename="Օգտատերեր">
                <Users />
            </PrivateRoute>

            <PrivateRoute exact path="/admin/users/:id" layout={AdminLayout} pagename="Փոփոխել օգտատիրոջ տվյալները">
                <EditUsers />
            </PrivateRoute>

            <PublicRoute path="/admin/not-found" layout={AdminLayout} pagename="Չի գտնվել">
				<AdminNotFound />
			</PublicRoute>

			<Redirect to="/not-found" />
		</Switch>
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
