import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { deviceTypesAtom, deviceTypeAtom } from '_state';

export { useDeviceTypeActions };

function useDeviceTypeActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/deviceTypes`;
    const fetchWrapper = useFetchWrapper();
    const setDeviceTypes = useSetRecoilState(deviceTypesAtom);
    const setDeviceType = useSetRecoilState(deviceTypeAtom);

    return {
        getAll,
        getById,
        create,
        update,
        delete: _delete,
        resetDeviceTypes: useResetRecoilState(deviceTypesAtom),
        resetDeviceType: useResetRecoilState(deviceTypeAtom)
    }


    function create(deviceType) {
        return fetchWrapper.post(`${baseUrl}/create`, deviceType);
    }


    function getAll() {
        return fetchWrapper.get(baseUrl).then(setDeviceTypes);
    }
    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setDeviceType);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setDeviceTypes(deviceTypes => deviceTypes.map(x => {
            // add isDeleting prop to deviceType being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove deviceType from list after deleting
                setDeviceTypes(deviceTypes => deviceTypes.filter(x => x.id !== id));
            });
    }
}
