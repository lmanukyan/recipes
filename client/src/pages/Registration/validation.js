import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().required('Դաշտը պարտադիր է լրացման համար'),
    email: yup.string().email('Սխալ email').required('Դաշտը պարտադիր է լրացման համար'),
    password: yup.string().required('Դաշտը պարտադիր է լրացման համար').min(6, 'Մինիմում 6 նիշ'),
});

export default schema;
