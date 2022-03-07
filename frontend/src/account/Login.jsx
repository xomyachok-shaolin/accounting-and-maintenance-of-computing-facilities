import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useUserActions } from '_actions';

export { Login };

function Login() {
    const userActions = useUserActions();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Имя пользователя обязательно к заполнению'),
        password: Yup.string().required('Пароль обязателен к заполнению')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    return (
        <div className="card m-3">
            <h4 className="card-header">Вход</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(userActions.login)}>
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
                        Вход
                    </button>
                    <Link to="register" className="btn btn-link">Регистрация</Link>
                </form>
            </div>
        </div>
    )
}
