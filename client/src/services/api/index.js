import auth from "./endpoints/auth";
import recipes from "./endpoints/recipes";
import categories from "./endpoints/categories";
import ingredients from "./endpoints/ingredients";
import users from "./endpoints/users";
import media from "./endpoints/media";

const allEndpoints = {
  auth,
  recipes,
  categories,
  ingredients,
  users,
  media,
};

export default allEndpoints;
