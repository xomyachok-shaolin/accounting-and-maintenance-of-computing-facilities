import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { deviceDetailsAtom, deviceDetailAtom } from '_state';

export { useDeviceDetailActions };

function useDeviceDetailActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/deviceDetails`;
    const fetchWrapper = useFetchWrapper();
    const setDeviceDetails = useSetRecoilState(deviceDetailsAtom);
    const setDeviceDetail = useSetRecoilState(deviceDetailAtom);

    return {
        getAll,
        getById,
        create,
        update,
        delete: _delete,
        resetDeviceDetails: useResetRecoilState(deviceDetailsAtom),
        resetDeviceDetail: useResetRecoilState(deviceDetailAtom)
    }


    function create(deviceDetail) {
        return fetchWrapper.post(`${baseUrl}/create`, deviceDetail);
    }


    function getAll() {
        return fetchWrapper.get(baseUrl).then(val => {
            var devices = []
            val.forEach(l => {
                if (l.devices){
                    devices = devices.concat(l.devices);
                    devices.map((d) => d.location = l.house+'/'+l.room);
                }
            });
            setDeviceDetails(devices)
        });
    }
    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setDeviceDetail);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setDeviceDetails(deviceDetails => deviceDetails.map(x => {
            // add isDeleting prop to deviceDetail being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove deviceDetail from list after deleting
                setDeviceDetails(deviceDetails => deviceDetails.filter(x => x.id !== id));
            });
    }
}
