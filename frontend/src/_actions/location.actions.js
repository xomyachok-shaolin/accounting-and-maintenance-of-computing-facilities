import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { locationsAtom, locationAtom, employeesAtom } from '_state';

export { useLocationActions };

function useLocationActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/locations`;
    const baseUrlEmp = `${process.env.REACT_APP_API_URL}/employees`;
    const fetchWrapper = useFetchWrapper();
    const setLocations = useSetRecoilState(locationsAtom);
    const setLocation = useSetRecoilState(locationAtom);
    const setEmployees = useSetRecoilState(employeesAtom);

    return {
        getAll,
        getAllEmployees,
        getById,
        create,
        update,
        delete: _delete,
        resetLocations: useResetRecoilState(locationsAtom),
        resetEmployees: useResetRecoilState(employeesAtom),
        resetLocation: useResetRecoilState(locationAtom)
    }


    function create(location) {
        return fetchWrapper.post(`${baseUrl}/create`, location);
    }


    function getAll() {
        return fetchWrapper.get(baseUrl).then(setLocations);
    }
    function getAllEmployees() {
        return fetchWrapper.get(baseUrlEmp).then(setEmployees);
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
