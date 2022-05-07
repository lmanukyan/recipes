import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/system';
import ruLocale from 'date-fns/locale/ru';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Link } from 'react-router-dom';
import api from "../../../services/api";
import { SiteRolesArray, getRoleLabel } from "../../../services/api/helper";

export default function Users() {

    const user = useSelector((state) => state.user);

    const columns = [
        { field: 'name', headerName: 'Անվանում', hideable: false, showable: false, flex: 3, },
        { field: 'email', headerName: 'Email', hideable: false, showable: false, flex: 3, },
        {
            field: 'role', headerName: 'Դեր', hideable: false, showable: false, flex: 3,
            valueGetter: (params) => getRoleLabel(params.row.role)
        },
        {
            field: 'createdAt', headerName: 'Գրանցվել է', hideable: false, showable: false, flex: 3,
            valueGetter: (params) => new Date(params.row.createdAt).toLocaleString()
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Գործողություններ',
            getActions: (params) => user.isAdmin ? [
                <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/users/${params.row.id}`} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Ջնջել" onClick={() => deleteUser(params.row)} />
            ] : (
                params.row.id === user.meta.id ? [
                    <GridActionsCellItem icon={<EditIcon />} label="Փոփոխել" component={Link} to={`/admin/users/${params.row.id}`} />,
                ] : []
            ),
            flex: 1
        },
    ];


    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [sort, setSort] = useState({createdAt: -1});

    const [filters, setFilters] = useState({
        name: '',
        email: '',
        role: '',
    });

    const loadUsers = async () => {
        const { data } = await api.users.getAll({
            skip: skip,
            sort: sort,
            filters: makeFilters()
        });
        setUsers(data.users);
        setCount(data.count);
        setLoading(false);
        console.log( data );
    }

    const pageChange = (page, details) => {
        setSkip(page * 10);
        setUsers([]);
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

    const deleteUser = async (rowUser) => {
        if(user.id === rowUser.id){
            alert('Դուք չեք կարող ջնջել սեփական պրոֆիլը');
            return;
        }

        if( window.confirm(`Ջնջել <${rowUser.name}> օգտատիրոջը ?`) ){
            const { data } = await api.users.delete(rowUser.id);
            loadUsers();
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
            if(name === 'name' || name === 'email'){
                filterData[name] = {$regex: filters[name], $options: 'i'};
            } else if(filters[name] !== ''){
                filterData[name] = filters[name];
            }
        }
        return filterData;
    }

    useEffect(() => {
        setLoading(true);
        loadUsers();
    }, [skip, sort, filters]);


    return (
        <Grid container direction="column"  spacing={2}>
            { user.isAdmin ? (
                <Grid item container justifyContent="end">
                    <Button
                        variant="contained"
                        component={Link}
                        startIcon={<AddIcon />}
                        to="/admin/users/add"
                    >
                        Ավելացնել
                    </Button>
                </Grid>
            ) : null }

            <Grid item container xs={12} spacing={1}>
                <Grid item xs={3}>
                    <TextField fullWidth label="Անուն" value={filters.name} onChange={(e) => setFilterProp('name', e.target.value)} />
                </Grid>
                <Grid item xs={3}>
                    <TextField fullWidth label="Email" value={filters.email} onChange={(e) => setFilterProp('email', e.target.value)} />
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>Դեր</InputLabel>
                        <Select
                            label="Դեր"
                            value={filters.role}
                            onChange={(e) => setFilterProp('role', e.target.value)}
                        >
                            {SiteRolesArray.map(({id, label}) => <MenuItem key={id} value={id}>{label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid item>
                <div style={{ height: 700, width: '100%' }}>
                    <DataGrid
                        rows={users}
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
