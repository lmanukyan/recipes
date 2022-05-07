import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ruLocale from 'date-fns/locale/ru';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Link } from 'react-router-dom';
import api from "../../../services/api";

export default function Recipes() {

    const user = useSelector((state) => state.user);
    const checkActionCaps = ({ row }) =>  user.isAdmin || row.author?.id === user.meta.id;

    const columns = [
      { field: 'title', headerName: 'Անվանում', width: 250, hideable: false, showable: false, flex: 1, },
      {
          field: 'categories',
          headerName: 'Կատեգորիաներ',
          width: 200,
          valueGetter: (params) => params.row.categories.map(c => c.title).join(','),
          hideable: false,
          showable: false,
          sortable: false,
          flex: 1,
      },
      {
          field: 'createdAt', headerName: 'Ամսաթիվ', width: 250, hideable: false, showable: false, flex: 1,
          valueGetter: (params) => new Date(params.row.createdAt).toLocaleString()
      },
      {
          field: 'author', headerName: 'Հեղինակ', width: 250, hideable: false, showable: false, flex: 1,
          valueGetter: (params) => params.row.author?.name
      },
      {
          field: 'actions',
          type: 'actions',
          headerName: 'Գործողություններ',
          width: 200,
          getActions: (params) => checkActionCaps(params) ? [
              <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/recipes/${params.row.id}`} />,
              <GridActionsCellItem icon={<DeleteIcon />} label="Ջնջել" onClick={() => deleteRecipe(params.row)} />
          ] : [],
          flex: 1,
      },
    ];


    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [count, setCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [sort, setSort] = useState({createdAt: -1});
    const [filters, setFilters] = useState({
        title: '',
        categories: [],
        dateFrom: null,
        dateTo: null
    });

    const [dateRange, setDateRange] = useState({dateFrom: null, dateTo : null});

    const loadRecipes = async () => {
        const { data } = await api.recipes.getAll({
            skip: skip,
            sort: sort,
            filters: makeFilters()
        });
        setRecipes(data.recipes);
        setCount(data.count);
        setLoading(false);
        console.log(data);
    }

    const loadCategories = async () => {
        const { data } = await api.categories.getAll({ limit: 0 });
        console.log(data);
        setCategories(data.categories);
    }

    const pageChange = (page, details) => {
        setSkip(page * 10);
        setRecipes([]);
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

    const deleteRecipe = async (recipe) => {
        if( window.confirm(`Ջնջել <${recipe.title}> բաղադրատոմսը ?`) ){
            const { data } = await api.recipes.delete(recipe._id);
            loadRecipes();
            console.log(recipe._id, data)
        }
    }

    const setFilterProp = (key, value) => {
        setFilters({
            ...filters,
            [key]: value
        })
    }

    const setDateFilter = (key, value) => {
        setDateRange({
            ...dateRange,
            [key]: value
        });
        if( value instanceof Date || value === null ){
            setFilters({
                ...filters,
                [key]: value
            })
        }
    }

    const makeFilters = () => {
        let filterData = {};
        for(let name in filters){
            if(name === 'title'){
                filterData[name] = {$regex: filters[name], $options: 'i'};
            } else if(name === 'categories'){
                filterData[name] = {$in: filters[name]};
            } else if(name === 'dateFrom' || name === 'dateTo'){
                let createdAt = {};
                if( filters.dateFrom ){
                    createdAt.$gte = filters.dateFrom.toISOString();
                }
                if( filters.dateTo ){
                    createdAt.$lt = filters.dateTo.toISOString();
                }
                if( createdAt ){
                    filterData.createdAt = createdAt;
                }
            } else{
                filterData[name] = filters[name];
            }
        }
        return filterData;
    }

    useEffect(() => {
        setLoading(true);
        loadRecipes();
    }, [skip, sort, filters]);

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <Grid container direction="column"  spacing={2}>
            <Grid item container justifyContent="end">
                <Button
                    variant="contained"
                    component={Link}
                    startIcon={<AddIcon />}
                    to="/admin/recipes/add"
                >
                    Ավելացնել
                </Button>
            </Grid>

            <Grid item container xs={12} spacing={1}>
                <Grid item xs={3}>
                    <TextField fullWidth label="Անվանում" value={filters.title} onChange={(e) => setFilterProp('title', e.target.value)} />
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>Կատեգորիաներ</InputLabel>
                        <Select
                            multiple
                            label="Կատեգորիաներ"
                            value={filters.categories}
                            onChange={(e) => setFilterProp('categories', e.target.value)}
                        >
                            {categories.map(category =>
                                <MenuItem key={category._id} value={category._id}>{category.title}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} local={ruLocale}>
                        <DatePicker
                            label="Ամսաթիվ սկսած"
                            mask="__.__.____"
                            inputFormat="dd.MM.yyyy"
                            maxDate={dateRange.dateTo}
                            value={dateRange.dateFrom}
                            onChange={(newValue) => setDateFilter('dateFrom', newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} local={ruLocale}>
                        <DatePicker
                            label="Ամսաթիվ վերջացրած"
                            mask="__.__.____"
                            inputFormat="dd.MM.yyyy"
                            minDate={dateRange.dateFrom}
                            value={dateRange.dateTo}
                            onChange={(newValue) => setDateFilter('dateTo', newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Grid item>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={recipes}
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
