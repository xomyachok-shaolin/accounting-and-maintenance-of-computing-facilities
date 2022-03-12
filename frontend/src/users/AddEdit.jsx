import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRecoilValue } from 'recoil';

import { userAtom } from '_state';
import { useUserActions, useAlertActions } from '_actions';

export { AddEdit };

function AddEdit({ history, match }) {
    const { id } = match.params;
    const mode = { add: !id, edit: !!id };
    const userActions = useUserActions();
    const alertActions = useAlertActions();
    const user = useRecoilValue(userAtom);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Пожалуйста, введите имя'),
        patronymic: Yup.string()
            .required('Пожалуйста, введите отчество'),
        lastName: Yup.string()
            .required('Пожалуйста, введите фамилию'),
        mail: Yup.string()
            .required('Электронная почта обязательна').email('Пожалуйста, введите действующий электронный адрес'),
        username: Yup.string()
            .required('Имя пользователя обязательно'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(mode.add ? Yup.string().required('Пароль обязателен') : null)
            .min(6, 'Пароль должен быть не менее 6 символов')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        // fetch user details into recoil state in edit mode
        if (mode.edit) {
            userActions.getById(id);
        }

        return userActions.resetUser;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // set default form values after user set in recoil state (in edit mode)
        if (mode.edit && user) {
            reset(user);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    function onSubmit(data) {
        return mode.add
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        return userActions.register(data)
            .then(() => {
                history.push('/users');
                alertActions.success('Пользователь добавлен');
            });
    }

    function updateUser(id, data) {
        return userActions.update(id, data)
            .then(() => {
                history.push('/users');
                alertActions.success('Информация о пользователе обновлена');
            });
    }

    const loading = mode.edit && !user;
    return (
        <>
            <h1>{mode.add ? 'Добавить пользователя' : 'Редактировать пользователя'}</h1>
            {!loading &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Фамилия</label>
                            <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </div>
                        <div className="form-group col">
                            <label>Имя</label>
                            <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </div>
                        <div className="form-group col">
                            <label>Отчество</label>
                            <input name="patronymic" type="text" {...register('patronymic')} className={`form-control ${errors.patronymic ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.patronymic?.message}
                        </div>
                    </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Электронная почта</label>
                            <input name="mail" type="text" {...register('mail')} className={`form-control ${errors.mail ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.mail?.message}</div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Имя пользователя</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>
                                Пароль
                                {mode.edit && <em className="ml-1">(Оставьте пустым, чтобы сохранить тот же пароль)</em>}
                            </label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Сохранить
                        </button>
                        <button onClick={() => reset(user)} type="button" disabled={isSubmitting} className="btn btn-secondary">Сбросить</button>
                        <Link to="/users" className="btn btn-link">Отмена</Link>
                    </div>
                </form>
            }
            {loading &&
                <div className="text-center p-3">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
        </>
    );
}
