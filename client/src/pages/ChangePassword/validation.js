import * as yup from "yup";

const schema = yup.object().shape({
	password: yup.string().required('Դաշտը պարտադիր է լրացման համար').min(6, 'Մինիմում 6 նիշ'),
	passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Գաղտնաբառը չի համնկնում')
});

export default schema;
