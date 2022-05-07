import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function AdminNotFound() {

	return (
		<Container maxWidth="sm">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h4" align="center" style={{marginBottom: 10}}>Չի գտնվել</Typography>
					<Typography variant="subtitle1">Հավանաբար, դուք սխալվել եք հասցեն մուտքագրելիս։</Typography>
				</Grid>
			</Grid>
		</Container>
	);
}
