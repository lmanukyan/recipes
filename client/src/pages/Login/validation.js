import * as yup from "yup";

const schema = yup.object().shape({
    email: yup.string().email('Սխալ email').required('Դաշտը պարտադիր է լրացման համար'),
    password: yup.string().required('Դաշտը պարտադիր է լրացման համար'),
});

export default schema;
