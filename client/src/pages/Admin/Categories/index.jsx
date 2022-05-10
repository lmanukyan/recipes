import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { Link } from 'react-router-dom';
import api from "../../../services/api";

const Spacer = styled('div')({
  marginLeft: 10,
  marginRight: 10,
});


export default function Categories() {

    const user = useSelector((state) => state.user);

    const columns = [
        { field: 'title', headerName: 'Անվանում', hideable: false, showable: false, flex: 3, },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Գործողություններ',
            getActions: (params) => user.isAdmin ? [
                <GridActionsCellItem icon={<VisibilityIcon />} label="Դիտել" component={Link} to={`/category/${params.row.slug}`} />,
                <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/categories/${params.row.id}`} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Ջնջել" onClick={() => deleteCategory(params.row)} />
            ] : (
                params.row.author?.id === user.meta.id ? [
                    <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/categories/${params.row.id}`} />,
                ] : []
            ),
            flex: 1
        },
    ];


    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [count, setCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [sort, setSort] = useState({createdAt: -1});

    const [filters, setFilters] = useState({
        title: '',
    });

    const loadCategories = async () => {
        const { data } = await api.categories.getAll({
            skip: skip,
            sort: sort,
            filters: makeFilters()
        });
        setCategories(data.categories);
        setCount(data.count);
        setLoading(false);
        console.log( data );
    }

    const pageChange = (page, details) => {
        setSkip(page * 10);
        setCategories([]);
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

    const deleteCategory = async (category) => {
        if( window.confirm(`Ջնջել <${category.title}> բաղադրատոմսը ?`) ){
            const { data } = await api.categories.delete(category.id);
            loadCategories();
            console.log(category.id, data)
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
        loadCategories();
    }, [skip, sort, filters]);


    return (
        <Grid container direction="column"  spacing={2}>
            <Grid item container justifyContent="end">
                <Button
                    variant="contained"
                    component={Link}
                    startIcon={<AddIcon />}
                    to="/admin/categories/add"
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
                        rows={categories}
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
