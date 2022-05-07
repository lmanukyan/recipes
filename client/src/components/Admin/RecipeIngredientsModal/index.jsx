import { useState, memo } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';

function RecipeIngredientsModal({ ingredients, modalOpened, setModalOpened, setModalSelectedIngredient }) {

    console.log('Render: RecipeIngredientsModal');

    const [selectedIngredient, setSelectedIngredient] = useState(null);

    const selectIngredient = () => {
        setModalSelectedIngredient(selectedIngredient);
        setModalOpened(false);
    }

    return (
        <Dialog open={modalOpened} onClose={() => setModalOpened(false)} fullWidth maxWidth="sm">
            <DialogTitle>Ընտրեք բաղադրիչը</DialogTitle>
            <DialogContent>
                <Autocomplete
                    fullWidth
                    disablePortal={false}
                    options={ingredients}
                    getOptionLabel={(option) => option.title}
                    onChange={(event, value) => setSelectedIngredient(value)}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.title}</li> }
                    renderInput={(params) => <TextField  {...params} label="Ընտրել" />}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={selectIngredient}>Ընտրել</Button>
            </DialogActions>
            <IconButton onClick={() => setModalOpened(false)} sx={{ position: 'absolute', right: 8, top: 8, }}>
                <CloseIcon />
            </IconButton>
        </Dialog>
    )
}

export default memo(RecipeIngredientsModal);