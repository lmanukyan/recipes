import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import kitchen from './kitchen.jpg';

const IntroWallpaper = styled(Grid)({
	width: '100%', 
	height: '60vh', 
	background: `url(${kitchen})`,
	backgroundPosition: 'center center',
	position: 'relative',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
    	left: 0,
    	width: '100%',
    	height: '100%',
    	background: '#00000052'
	}
})

const IntroText = styled(Typography)({
	fontSize: 26,
	zIndex: 9,
	color: 'white',
	textAlign: 'center',
	textShadow: '5px 5px 20px #000'
})

export default function Intro() {
	return (
        <IntroWallpaper container alignItems="center" justifyContent="center">
			<IntroText>Փնտրիր համեղ բաղադրատոմսեր <br/> ըստ բաղադրիչների</IntroText>
		</IntroWallpaper>
    )
}
