import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '_helpers';
import { adminAtom, authAtom, usersAtom, userAtom, collapseAtom, locationsAtom, locationAtom } from '_state';
import { submitAtom } from '_state';
import { rolesAtom } from '_state/roles';

export { useLocationActions };

function useLocationActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/locations`;
    const fetchWrapper = useFetchWrapper();
    const [auth, setAuth] = useRecoilState(authAtom);
    const [collapse, setCollapse] = useRecoilState(collapseAtom);
    const [submit, setSubmit] = useRecoilState(submitAtom);
    const [admin, setAdmin] = useRecoilState(adminAtom);
    const setLocations = useSetRecoilState(locationsAtom);
    const setLocation = useSetRecoilState(locationAtom);
    const setRoles = useSetRecoilState(rolesAtom);

    return {
        getAll,
        getById,
        update,
        delete: _delete,
        resetLocations: useResetRecoilState(locationsAtom),
        resetLocation: useResetRecoilState(locationAtom)
    }


    function create(location) {
        return fetchWrapper.post(`${baseUrl}/create`, location);
    }


    function getAll() {
        return fetchWrapper.get(baseUrl).then(setLocations);
    }

    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setLocation);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setLocations(locations => locations.map(x => {
            // add isDeleting prop to location being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove Location from list after deleting
                setLocations(locations => locations.filter(x => x.id !== id));
            });
    }
}
