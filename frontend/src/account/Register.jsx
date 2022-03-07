import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useUserActions, useAlertActions } from '_actions';

export { Register };

function Register({ history }) {
    const userActions = useUserActions();
    const alertActions = useAlertActions();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Имя'),
        lastName: Yup.string()
            .required('Фамилия'),
        username: Yup.string()
            .required('Имя пользователя обязательно'),
        password: Yup.string()
            .required('Пароль обязательно')
            .min(6, 'Пароль должен быть не менее 6 символов')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit(data) {
        return userActions.register(data)
            .then(() => {
                history.push('/account/login');
                alertActions.success('Регистрация успешна');
            })
    }

    return (
        <div className="card m-3">
            <h4 className="card-header">Регистрация</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Имя</label>
                        <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.firstName?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Фамилия</label>
                        <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.lastName?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Имя пользователя</label>
                        <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.username?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <button disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Регистрация
                    </button>
                    <Link to="login" className="btn btn-link">Отмена</Link>
                </form>
            </div>
        </div>
    )
}
