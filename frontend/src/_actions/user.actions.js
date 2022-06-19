import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '_helpers';
import { userRolesAtom, authAtom, usersAtom, userAtom, collapseAtom } from '_state';
import { submitAtom } from '_state';
import { rolesAtom } from '_state/roles';

export { useUserActions };

function useUserActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;
    const baseRoleUrl = `${process.env.REACT_APP_API_URL}/roles`;
    const fetchWrapper = useFetchWrapper();
    const [auth, setAuth] = useRecoilState(authAtom);
    const [collapse, setCollapse] = useRecoilState(collapseAtom);
    const [submit, setSubmit] = useRecoilState(submitAtom);
    const [userRoles, setUserRoles] = useRecoilState(userRolesAtom);
    const setUsers = useSetRecoilState(usersAtom);
    const setUser = useSetRecoilState(userAtom);
    const setRoles = useSetRecoilState(rolesAtom);

    return {
        login,
        switchMenu,
        switchLoading,
        logout,
        createRole,
        register,
        getAll,
        getAllRoles,
        getById,
        update,
        updateRole,
        delete: _delete,
        deleteRole: _deleteRole,
        resetUsers: useResetRecoilState(usersAtom),
        resetUser: useResetRecoilState(userAtom)
    }

    function login({ username, password }) {
        setSubmit(true);
        return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
            .then(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                setAuth(user);
                setUserRoles(user.roles.$values);

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.push(from);
            })
            .finally(()=> {
                setSubmit(false);
            })
    }


    function switchMenu() {
        setCollapse(!collapse);
    }

    function switchLoading() {
        setSubmit(!submit);
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('user');
        setAuth(null);
        setUserRoles([])
        
        history.push('/account/login');
    }

    function register(user) {
        return fetchWrapper.post(`${baseUrl}/register`, user);
    }

    function createRole(role) {
        return fetchWrapper.post(`${baseRoleUrl}/create`, role);
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(setUsers);
    }
    function getAllRoles() {
        return fetchWrapper.get(baseRoleUrl).then(setRoles);
    }

    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setUser);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                // update stored user if the logged in user updated their own record
                if (id === auth?.id) {
                    // update local storage
                    const user = { ...auth, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // update auth user in recoil state
                    setAuth(user);
                }
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setUsers(users => users.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === id)
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove user from list after deleting
                setUsers(users => users.filter(x => x.id !== id));

                // auto logout if the logged in user deleted their own record
                if (id === auth?.id) {
                    logout();
                }
            });
    }

    function updateRole(id, params) {
        return fetchWrapper.put(`${baseRoleUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _deleteRole(id) {
        setRoles(roles => roles.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === id)
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseRoleUrl}/${id}`)
            .then(() => {
                // remove role from list after deleting
                setRoles(roles => roles.filter(x => x.id !== id));

            });
    }
}
