import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { deviceParametersAtom, deviceParameterAtom } from '_state';

export { useDeviceParameterActions };

function useDeviceParameterActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/deviceParameters`;
    const fetchWrapper = useFetchWrapper();
    const setDeviceParameters = useSetRecoilState(deviceParametersAtom);
    const setDeviceParameter = useSetRecoilState(deviceParameterAtom);

    return {
        getAll,
        getById,
        create,
        createDeviceParameter,
        updateDeviceParameter,
        update,
        delete: _delete,
        resetDeviceParameters: useResetRecoilState(deviceParametersAtom),
        resetDeviceParameter: useResetRecoilState(deviceParameterAtom)
    }


    function create(deviceParameter) {
        return fetchWrapper.post(`${baseUrl}/create`, deviceParameter);
    }

    function createDeviceParameter(deviceParameter) {
        return fetchWrapper.post(`${baseUrl}/createDeviceParameter`, deviceParameter);
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(setDeviceParameters);
    }
    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setDeviceParameter);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }
    function updateDeviceParameter(id, params) {
        return fetchWrapper.put(`${baseUrl}/updateDeviceParameter/${id}`, params)
            .then(x => {
                return x;
            });
    }
    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setDeviceParameters(deviceParameters => deviceParameters.map(x => {
            // add isDeleting prop to deviceParameter being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove deviceParameter from list after deleting
                setDeviceParameters(deviceParameters => deviceParameters.filter(x => x.id !== id));
            });
    }
}
