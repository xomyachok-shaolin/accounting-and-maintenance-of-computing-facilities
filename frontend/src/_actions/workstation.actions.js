import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { workstationAtom, workstationsAtom } from '_state';

export { useWorkstationActions };

function useWorkstationActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/workstations`;
    const fetchWrapper = useFetchWrapper();
    const setWorkstation = useSetRecoilState(workstationAtom);
    const setWorkstations = useSetRecoilState(workstationsAtom);

    return {
        getAll,
        getById,
        create,
        update,
        updateDevices,
        delete: _delete,
        resetWorkstation: useResetRecoilState(workstationAtom),
        resetWorkstations: useResetRecoilState(workstationsAtom),
    }


    function create(workstation) {
        return fetchWrapper.post(`${baseUrl}/create`, workstation);
    }


    function getAll() {
        return fetchWrapper.get(baseUrl).then(setWorkstations);
    }


    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setWorkstation);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }

    function updateDevices(data) {
        return fetchWrapper.post(`${baseUrl}/update/devices`, data);
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setWorkstation(workstations => workstations.map(x => {
            // add isDeleting prop to deviceDetail being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove deviceDetail from list after deleting
                setWorkstation(setWorkstations => setWorkstations.filter(x => x.id !== id));
            });
    }
}
