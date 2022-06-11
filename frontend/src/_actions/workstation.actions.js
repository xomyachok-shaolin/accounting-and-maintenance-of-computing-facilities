import { useSetRecoilState,useRecoilValue,useRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { deviceTransfersAtom, filterWorkstationsAtom,workstationTransfersAtom,locationsAtom,flagUpdateAtom,filterDevicesAtom,selectedModelAtom, locationAtom, workstationAtom, workstationsAtom } from '_state';

export { useWorkstationActions };

function useWorkstationActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/workstations`;
    const baseUrlWT = `${process.env.REACT_APP_API_URL}/workstations/workstationTransfers`;
    const baseUrlDT = `${process.env.REACT_APP_API_URL}/workstations/deviceTransfers`;
    const fetchWrapper = useFetchWrapper();
    const setWorkstation = useSetRecoilState(workstationAtom);
    const [workstationTransfers, setWorkstationTransfers] = useRecoilState(workstationTransfersAtom);
    const [deviceTransfers, setDeviceTransfers] = useRecoilState(deviceTransfersAtom);
     const [flagUpdate, setFlagUpdate] = useRecoilState(flagUpdateAtom);
   
    return {
        getAllWT,
        getAllDT,
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


    function getAllWT() {
        return fetchWrapper.get(baseUrlWT).then((wt) => {
           let workstationTransfers = JSON.parse(JSON.stringify(wt));
           workstationTransfers.status = true        
            setWorkstationTransfers(workstationTransfers)
            if (deviceTransfers != null)
            if (deviceTransfers.status != false)
            setFlagUpdate(true)
        });
    }

    function getAllDT() {
        return fetchWrapper.get(baseUrlDT).then((dt)=>{
            let deviceTransfers = JSON.parse(JSON.stringify(dt));
            deviceTransfers.status = true        
             setDeviceTransfers(deviceTransfers)
             if (workstationTransfers != null)
             if (workstationTransfers.status != false)
             setFlagUpdate(true)
 
        });
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

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then((x) => {
                return x;
               });
    }
}
