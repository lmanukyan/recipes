import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

import api from "../../../services/api";


const useStyles = makeStyles({
    equalImage: {
        minHeight: 200,
        maxHeight: 200,
        cursor: 'pointer'
    },
    initialImage: {
        border: '5px solid #fff',
    },
    activeImage: {
        border: '5px solid #1976d2',
        boxShadow: '0 0 5px #000',
    },
    selectButton: {
        marginRight: 10
    },
    imageActions: {
        background: 'transparent'
    },
    imageActionButton: {
        background: '#ff7575',
        margin: 3,
        '&:hover': {
            background: '#ff0000',
            color: '#fff'
        }
    }
});

export default function MediaUploader({ setRecipeThumbnail, setMediaUploaderOpened }){
    const classes = useStyles();
    const searchTerm = useRef();
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [activeImage, setActiveImage] = useState(null);
    const [images, setImages] = useState([]);


    const loadmedias = async (params, append = false) => {
        setLoading(true);
        const { data } = await api.media.getAll(params);
        console.log(data);
        if(append){
            setImages([
                ...images,
                ...data
            ]);
        }else{
            setImages(data);
        }
        setLoading(false);
    }

    const selectTab = (event, value) => {
        setActiveTab(value);
    };

    const selectImage = (image) => {
        if( activeImage == null || activeImage._id !== image._id ){
            setActiveImage(image);
        }else{
            setActiveImage(null);
        }
    }

    const selectFile = async (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        try{
            const { data } = await api.media.upload(formData);
            images.unshift(data);
            setActiveImage(data);
            setActiveTab('1');
        } catch( e ){
            console.log(e.response.data)
        }
    }

    const loadMoreImages = () => {
        loadmedias({skip: images.length}, true);
    }

    const deleteImage = async (id) => {
        if( window.confirm('Հաստատում եք ջնջել հրամանը ?') ){
            const { data } = await api.media.delete(id);
            if(data){
                setImages(images.filter(i => i._id !== id));
            }
        }
    }

    const searchImages = () => {
        let term = searchTerm.current.value;
        if(term){
            loadmedias({
                filter: { path: {'$regex': term} }
            });
        }else{
            loadmedias();
        }
    }

    const isActive = (id) => activeImage?._id === id;

    useEffect(() => {
        loadmedias();
    }, [])

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
        	<TabContext value={activeTab}>
        		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={4}>
                			<TabList onChange={selectTab}>
                				<Tab label="Մեդիադարան" value="1" />
                				<Tab label="Ներբեռնել" value="2" />
                			</TabList>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 35 }}>
                            	<InputBase sx={{ ml: 1, flex: 1 }} placeholder="Փնտրել..." inputRef={searchTerm} />
                            	<IconButton type="submit" sx={{ p: '10px' }} onClick={searchImages}>
                            		<SearchIcon />
                            	</IconButton>
                            </Paper>

                        </Grid>
                        <Grid item container xs={4} justifyContent="end">
                            { activeImage && <Button onClick={() => {setRecipeThumbnail(activeImage); setMediaUploaderOpened(false);}} variant="contained" className={classes.selectButton}>Տեղադրել</Button> }
                        </Grid>
                    </Grid>
        		</Box>
        		<TabPanel value="1">
                    <ImageList cols={4} gap={8} rowHeight={210} style={{overflow: 'initial'}}>
                        {images.map(item => (
                            <ImageListItem key={item._id} className={isActive(item._id) ? classes.activeImage : classes.initialImage}>
                                <img
                                    src={process.env.REACT_APP_DOMAIN_URL + item.path}
                                    onClick={() => selectImage(item)}
                                    className={classes.equalImage}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    className={classes.imageActions}
                                	position="top"
                                	actionPosition="right"
                                	actionIcon={
                                		<IconButton className={classes.imageActionButton} onClick={() => deleteImage(item._id)}>
                                			{ user.isAdmin && <DeleteIcon /> }
                                		</IconButton>
                                	}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <Grid container alignItems="center" justifyContent="center">
                        { loading && <CircularProgress color="inherit" /> }
                        { ! loading && <Button onClick={loadMoreImages}>Ցուցադրել ավելին</Button> }
                    </Grid>
                </TabPanel>
        		<TabPanel value="2">
                    <Grid container justifyContent="center">
                        <label htmlFor="file-input">
                            <input type="file" id="file-input" onChange={selectFile} accept="image/*" style={{display: 'none'}} />
                            <Button variant="contained" endIcon={<PhotoCamera />} component="span">Ընտրել</Button>
                        </label>
                    </Grid>
                </TabPanel>
        	</TabContext>
        </Box>
    )
}
