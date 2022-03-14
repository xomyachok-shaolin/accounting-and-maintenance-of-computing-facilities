import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { usersAtom } from '_state';
import { useUserActions } from '_actions';

export { List };

function List({ match }) {
    const { path } = match;
    const users = useRecoilValue(usersAtom);
    const userActions = useUserActions();

    useEffect(() => {
        userActions.getAll();
        
        return userActions.resetUsers;
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Управление пользователями</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Добавить пользователя</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Адрес электронной почты</th>
                        <th style={{ width: '20%' }}>Имя пользователя</th>
                        <th style={{ width: '15%' }}>Фамилия</th>
                        <th style={{ width: '15%' }}>Имя</th>
                        <th style={{ width: '15%' }}>Отчество</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(user =>
                        <tr key={user.id}>
                            <td>{user.mail}</td>
                            <td>{user.username}</td>
                            <td>{user.lastName}</td>
                            <td>{user.firstName}</td>
                            <td>{user.patronymic}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Редактировать</Link>
                                <button onClick={() => userActions.delete(user.id)} className="btn btn-sm btn-danger" style={{ width: '70px' }} disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Удалить</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
