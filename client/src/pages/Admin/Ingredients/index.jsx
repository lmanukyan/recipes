import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { Link } from 'react-router-dom';
import api from "../../../services/api";


export default function Ingredients() {

    const user = useSelector((state) => state.user);

    const columns = [
        { field: 'title', headerName: 'Անվանում', hideable: false, showable: false, flex: 3, },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Գործողություններ',
            getActions: (params) => user.isAdmin ? [
                <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/ingredients/${params.row.id}`} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Ջնջել" onClick={() => deleteIngredient(params.row)} />
            ] : (
                params.row.author?.id === user.meta.id ? [
                    <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/ingredients/${params.row.id}`} />,
                ] : []
            ),
            flex: 1
        },
    ];


    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [count, setCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [sort, setSort] = useState({createdAt: -1});

    const [filters, setFilters] = useState({
        title: '',
    });

    const loadIngredients = async () => {
        const { data } = await api.ingredients.getAll({
            skip: skip,
            sort: sort,
            filters: makeFilters()
        });
        setIngredients(data.ingredients);
        setCount(data.count);
        setLoading(false);
        console.log( data );
    }

    const pageChange = (page, details) => {
        setSkip(page * 10);
        setIngredients([]);
    }

    const handleSortChange = (sortModel) => {
        if(sortModel.length){
            setSort({
                [sortModel[0].field]: sortModel[0].sort === 'asc' ? 1 : -1
            });
        }else {
            setSort({id: -1});
        }
        console.log(sortModel);
    }

    const deleteIngredient = async (ingredient) => {
        if( window.confirm(`Ջնջել <${ingredient.title}> բաղադրատոմսը ?`) ){
            const { data } = await api.ingredients.delete(ingredient.id);
            loadIngredients();
            console.log(ingredient.id, data)
        }
    }

    const setFilterProp = (key, value) => {
        setFilters({
            ...filters,
            [key]: value
        })
    }



    const makeFilters = () => {
        let filterData = {};
        for(let name in filters){
            if(name === 'title'){
                filterData[name] = {$regex: filters[name], $options: 'i'};
            } else{
                filterData[name] = filters[name];
            }
        }
        return filterData;
    }

    useEffect(() => {
        setLoading(true);
        loadIngredients();
    }, [skip, sort, filters]);


    return (
        <Grid container direction="column"  spacing={2}>
            <Grid item container justifyContent="end">
                <Button
                    variant="contained"
                    component={Link}
                    startIcon={<AddIcon />}
                    to="/admin/ingredients/add"
                >
                    Ավելացնել
                </Button>
            </Grid>

            <Grid item container xs={12} spacing={1}>
                <Grid item xs={3}>
                    <TextField fullWidth label="Անվանում" value={filters.title} onChange={(e) => setFilterProp('title', e.target.value)} />
                </Grid>
            </Grid>

            <Grid item>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={ingredients}
                        columns={columns}
                        loading={loading}
                        rowCount={count}
                        pageSize={10}
                        paginationMode="server"
                        filterMode="server"
                        sortingMode="server"
                        onPageChange={pageChange}
                        onSortModelChange={handleSortChange}
                        checkboxSelection={false}
                        disableColumnMenu={true}
                    />
                </div>
            </Grid>
        </Grid>
    );
}
