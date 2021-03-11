import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';





import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { toDate } from 'date-fns';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 20,
        flexGrow: 1,

    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        padding: 50
    }
}));

export default function Filter() {
    const classes = useStyles();

    const init = {
        page: '',
        pagesize: '',
        q: '',
        title: '',
        tagged: '',
        user: '',
        order: '',
        sort: '',
        accepted: ''

    };
    const [state, setState] = useState(init);
    const [fromdate, setFromdate] = useState(null);
    const [todate, setTodate] = useState(null);
    const [data, setData] = useState([]);
    const [paginationCalled, setPaginationCalled] = useState(false);
    const[loading, setLoading] = useState(false);


    const handleInputChange = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setState({
            ...state, [name]: value
            // ...state  
        });

    }
    const handlePagination = async (event, value) => {
        event.preventDefault();


        setPaginationCalled(true);
        setState({
            ...state, page: String(value)
            // ...state  
        });



    }

    const cngDate = (event) => {
        let datetime = (event.target.value).split("-");
        // debugger ;
        if (event.target.name === 'fromdate')
            setFromdate(Math.round(new Date(datetime) / 1000))
        else setTodate(Math.round(new Date(datetime) / 1000))

    }

    useEffect(() => {

        if (paginationCalled) handleSubmit(null);
    }, [state, paginationCalled])

    let checkVal = (str) => {
        console.log(str)
        if (str === '' || str === null)return false;
        return true;
    }

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();

        let qs = "http://localhost:8000/api/stackoverflow?"
        Object.keys(state).forEach(key => {
            if (key === 'pagesize') {

                if (state[key] === '') qs += ('&' + key + '=' + '5')

            }
            console.log("===", key, state[key])
            if (checkVal(state[key])) qs += ('&' + key + '=' + state[key])
        })
        if (checkVal(fromdate)) qs += ('&' + 'fromdate' + '=' + fromdate);
        if (checkVal(todate)) qs += ('&' + 'todate' + '=' + todate);
        //debugger
        console.log(qs)
        console.log(state)
        setPaginationCalled(false);

        setLoading(true);
        await axios.get(qs, { crossdomain: true })
            .then(function (response) {
                //console.log(response.data.success.items)
                setData(response.data.success.items)
                setLoading(false)
            })
            .catch(function (error) {
                // handle error
                setLoading(false)
                console.log(error)
                if (error.response.status === 429)
                    alert('Too many request');
            })


    }
    return (
        <div className={classes.root}>

            <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
                    <label>
                        Page
                            <input
                            type="text"
                            name="page"
                            value={state.page}
                            onChange={handleInputChange}
                        />
                    </label>
                </Grid>
                <Grid item xs={12} md={3}>
                    <label>
                        Page Size
                            <input
                            type="text"
                            name="pagesize"
                            value={state.pagesize}
                            onChange={handleInputChange}
                        />
                    </label>
                </Grid>
                <Grid item xs={12} md={3}>
                    <label>From Date</label>
                    <input placeholder="yyyy-mm-dd" name="fromdate" onChange={cngDate} />
                </Grid>

                <Grid item xs={12} md={3}>
                    <label>To Date</label>
                    <input placeholder="yyyy-mm-dd" name="todate" onChange={cngDate} />
                </Grid>

                <Grid item xs={12} md={3}>
                    <label>
                        Q
                            <input
                            type="text"
                            name="q"
                            value={state.q}
                            onChange={handleInputChange}
                        />
                    </label>
                </Grid>
                <Grid item xs={12} md={3}>
                    <label>
                        Title
                            <input
                            type="text"
                            value={state.title}
                            name="title"
                            onChange={handleInputChange}
                        />
                    </label>
                </Grid>
                <Grid item xs={12} md={3}>
                    <label>
                        Tagged
                            <input
                            type="text"
                            value={state.tagged}
                            name="tagged"
                            onChange={handleInputChange}
                        />
                    </label>
                </Grid>
                <Grid item xs={12} md={3}>
                    <label>
                        User
                            <input
                            type="text"
                            value={state.user}
                            name="user"
                            onChange={handleInputChange}
                        />
                    </label>
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-native-simple">Order</InputLabel>
                        <Select
                            native
                            value={state.order}
                            onChange={handleInputChange}
                            inputProps={{
                                name: 'order',
                                id: 'age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={'desc'}>Desc</option>
                            <option value={'asc'}>Asc</option>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-native-simple">Sort</InputLabel>
                        <Select
                            native
                            value={state.sort}
                            onChange={handleInputChange}
                            inputProps={{
                                name: 'sort',
                                id: 'age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={'activity'}>activity</option>
                            <option value={'votes'}>votes</option>
                            <option value={'creation'}>creation</option>
                            <option value={'relevance'}>relevance</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-native-simple">accepted</InputLabel>
                        <Select
                            native
                            value={state.accepted}
                            onChange={handleInputChange}
                            inputProps={{
                                name: 'accepted',
                                id: 'age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={'True'}>True</option>
                            <option value={'False'}>False</option>

                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-native-simple">closed</InputLabel>
                        <Select
                            native
                            value={state.closed}
                            onChange={handleInputChange}
                            inputProps={{
                                name: 'closed',
                                id: 'age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={'True'}>True</option>
                            <option value={'False'}>False</option>

                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
            <Button style={{ margin: 30 }} variant="contained" color="primary" onClick={handleSubmit}>submit</Button>
            { loading && <CircularProgress />}

            <table style={{ padding: '1%' }}>
                <thead>
                    <tr>
                        <th>Search Results</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((items, index) => (
                        <tr key={index}>
                            <td>{index + 1}.  <a href={items.link} >{items.title}</a></td>
                        </tr>
                    ))}
                </tbody>

            </table>
            {data.length > 0 && <Pagination count={state.pagesize === '' ? 5 : state.pagesize} page={parseInt(state.page) || 1} onChange={handlePagination} />}
        </div>
    );
}
