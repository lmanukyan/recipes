import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Recipe({ slug, title, thumbnail, instructions }) {
	const history = useHistory();

	return (
		<Grid item md={4}>
			<Card style={{height: '100%'}} onClick={() => history.push(`/recipe/${slug}`)}>
				{ thumbnail ? (
					<CardMedia
						component="img"
						height="240"
						image={process.env.REACT_APP_DOMAIN_URL + thumbnail.path}
						alt="green iguana"
					/>
				) : <Skeleton variant="rectangular" height={240} /> }
				<CardContent>
					<Typography gutterBottom variant="h6" component="div">
						{title}
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
}