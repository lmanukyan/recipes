
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  AppBar: {
    background: "#ededed",
    color: "#000000",
    padding: 15
  }
}));

function Footer() {
	const { t } = useTranslation();
	const classes = useStyles();	

	return (
	    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className={classes.AppBar}>
	    	<Container maxWidth="lg">
	    		<Grid container
	    		  alignItems="center"
	    		  spacing={3}
	    		>
	    			<Grid item xs={12}>
	    				<Typography variant="subtitle2" align="center">© 2022. Բոլոր իրավունքները պաշտպանված են․</Typography>
	    			</Grid>
	    		</Grid>
	    	</Container>
	    </AppBar>
	);
}

export default Footer;
