import { useState, memo } from 'react';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ObjectStorage from '../../services/objectStorage';

const RecipeTitle = styled(Link)({
	color: '#000000de',
	fontSize: '1.4rem',
	textDecoration: 'none',
});

function Recipe({ id, slug, title, thumbnail, gridCol = 4 }) {

	const [wishlisted, setWishlisted] = useState(() => {
		let ids = Array.from( ObjectStorage.get('recipes_wishlist') );
		return ids.filter(wid => wid == id).length > 0;
	});

	const handleWishlist = () => {
		let ids = Array.from( ObjectStorage.get('recipes_wishlist') );
		if(ids.includes(id)){
			ids = ids.filter(wid => wid != id);
			setWishlisted(false);
		} else {
			ids.push(id);
			setWishlisted(true);
		}
		ObjectStorage.set('recipes_wishlist', ids);
		window.dispatchEvent(new Event('recipes_wishlist'));
	}

	return (
		<Grid item lg={gridCol} md={6}>
			<Card style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
				{ thumbnail ? (
					<CardMedia
						component="img"
						height="240"
						image={process.env.REACT_APP_DOMAIN_URL + thumbnail.path}
						alt={title}
					/>
				) : <Skeleton variant="rectangular" height={240} /> }
				<CardContent style={{flex: '1 1 auto'}}>
					<RecipeTitle to={`/recipe/${slug}`}>{title}</RecipeTitle>
				</CardContent>
				<CardActions disableSpacing style={{justifyContent: 'space-between'}}>
					<IconButton onClick={handleWishlist}>
						<FavoriteIcon style={{fill: wishlisted ? '#ff0000' : '#cbcbcb'}} />
					</IconButton>
					<Button component={Link} to={`/recipe/${slug}`}>Դիտել</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}

export default memo(Recipe);