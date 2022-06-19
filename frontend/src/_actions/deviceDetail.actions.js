import {
  useSetRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useRecoilState,
} from "recoil";

import { useFetchWrapper } from "_helpers";
import {
  deviceDetailsAtom,
  deviceDetailAtom,
  filterParametersAtom,
  filterDevicesAtom,
  locationsAtom,
  deviceTransfersAtom,
  workstationTransfersAtom,
  filterWorkstationsAtom,
  selectedModelAtom,submitAtom,
} from "_state";

export { useDeviceDetailActions };

function useDeviceDetailActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/deviceDetails`;
  const fetchWrapper = useFetchWrapper();
  const setDeviceDetails = useSetRecoilState(deviceDetailsAtom);
  const setDeviceDetail = useSetRecoilState(deviceDetailAtom);
  const setFilterParameters = useSetRecoilState(filterParametersAtom);
  const setFilterDevices = useSetRecoilState(filterDevicesAtom);
  const setFilterWorkstations = useSetRecoilState(filterWorkstationsAtom);
  const [selectedModel, setSelectedModel] = useRecoilState(selectedModelAtom);
  const [submit, setSubmit] = useRecoilState(submitAtom);
 const [workstationTransfers, setWorkstationTransfers] = useRecoilState(
    workstationTransfersAtom
  );
  const [deviceTransfers, setDeviceTransfers] =
    useRecoilState(deviceTransfersAtom);

  return {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    resetDeviceDetails: useResetRecoilState(deviceDetailsAtom),
    resetDeviceDetail: useResetRecoilState(deviceDetailAtom),
    resetFilterParameters: useResetRecoilState(filterParametersAtom),
  };

  function create(deviceDetail) {
    return fetchWrapper.post(`${baseUrl}/create`, deviceDetail);
  }

  function getAll() {
    return fetchWrapper.get(baseUrl).then((dd0) => {
var dd = dd0.$values
      setDeviceDetails(dd);

      var selected = null;

        if (selectedModel?.key == null || submit == true) {
          dd?.forEach((dt) => {
            dt.deviceModels.$values.forEach((dm) => {
              if (dm.id == selectedModel?.dm?.id || selectedModel?.deviceType == dt.name) {
                selected = dm;
                const d = JSON.parse(JSON.stringify(dm.devices.$values));
                d.forEach((device) => {
                  device.deviceModel = dm.name;
                });
                setFilterDevices(d);
              }
            });
          });
        } else {
          var devices = [];
          var workstations = [];
          let regexpWS = /\d-\d-\d-\d/,
            regexpRoom = /\d-\d-\d/;

          if (regexpWS.test(selectedModel.pos)) {
            //setIsEditWS(true);
            workstationTransfers.$values.forEach((wt) => {
              // console.log(wt);
              if (wt.dateOfRemoval == null)
                if (wt.workstation.id == selectedModel.key) {
                  let workstation = JSON.parse(JSON.stringify(wt.workstation));
                  workstation.wt = wt;
                  //setEditWS(workstation);
                  workstations.push({
                    key: workstation.id,
                    registerNumber: workstation.registerNumber,
                    networkName: workstation.networkName,
                    ipAddress: workstation.ipAddress,
                    dateOfInstallation: workstation.wt.dateOfInstallation,
                    wt: wt,
                  });
                }
            });

            deviceTransfers?.$values.forEach((dt) => {
              let device = JSON.parse(JSON.stringify(dt.device));
              workstationTransfers.forEach((wt) => {
                if (wt.dateOfRemoval == null)
                  if (wt.workstation.id == dt.idWorkstation)
                    device.location = wt.location;
              });
              device.useType = dt.useType;
              device.workstation = dt.workstation;
              if (dt.dateOfRemoval == null)
                if (dt.idWorkstation == selectedModel.key) {
                  // console.log(dt);
                  devices.push(device);
                }
            });
          } else if (regexpRoom.test(selectedModel.pos)) {
            //setIsEditWS(false);
            deviceTransfers.$values.forEach((dt) => {
              let device = JSON.parse(JSON.stringify(dt.device));
              device.useType = dt.useType;
              device.location = dt.location;
              device.workstation = dt.workstation;

              if (dt.dateOfRemoval == null)
                if (dt.location) {
                  if (dt.location.id == selectedModel.key.slice(12))
                    devices.push(device);
                } else {
                  workstationTransfers.$values.forEach((wt) => {
                    if (wt.dateOfRemoval == null)
                      if (wt.workstation.id == dt.idWorkstation)
                        device.location = wt.location;
                  });
                  device.workstation = dt.workstation;

                  if (device.location.id == selectedModel.key.slice(12)) {
                    devices.push(device);
                  }
                }
            });
          } else {
            //console.log(deviceTransfers)
            deviceTransfers.$values.forEach((dt) => {
              let device = JSON.parse(JSON.stringify(dt.device));
              device.useType = dt.useType;
              device.location = dt.location;
              if (dt.dateOfRemoval == null)
                if (dt.location) {
                  if (device.location.house == selectedModel.key)
                    devices.push(device);
                } else {
                  workstationTransfers.$values.forEach((wt) => {
                    if (wt.dateOfRemoval == null) {
                      if (wt.workstation.id == dt.idWorkstation)
                        device.location = wt.location;
                    }
                  });
                  device.workstation = dt.workstation;
                  if (device.location?.house == selectedModel.key) {
                    devices.push(device);
                  }
                }
            });
          }

          setFilterDevices(devices);

          if (typeof selectedModel?.key == "string")
            workstationTransfers.$values.forEach((wt) => {
              if (wt.dateOfRemoval == null)
                if (
                  wt.location.id == selectedModel.key.slice(12) ||
                  wt.location.house == selectedModel.key
                ) {
                  workstations.push({
                    key: wt.id,
                    registerNumber: wt.workstation.registerNumber,
                    networkName: wt.workstation.networkName,
                    ipAddress: wt.workstation.ipAddress,
                    dateOfInstallation: wt.dateOfInstallation,
                    wt: wt,
                  });
                }
            });

          setFilterWorkstations(workstations);

          let l = JSON.parse(JSON.stringify(deviceTransfers));
          l.status = false;
          setDeviceTransfers(l);

          let ws = JSON.parse(JSON.stringify(workstationTransfers));
          ws.status = false;
          setWorkstationTransfers(ws);
        } // console.log(devices, selectedModel)

      var parameters = [];
      selected?.deviceParameterValues.$values.forEach((dp) => {
        parameters.push({
          key: dp.deviceParameter.id,
          name: dp.deviceParameter.name,
          description: dp.value,
          deviceModel: selectedModel?.deviceModel,
          deviceType: selectedModel?.deviceType,
        });
      });

      setSubmit(false)
      setFilterParameters(parameters);
    });
  }

  function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`).then(setDeviceDetail);
  }

  function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params).then((x) => {
      return x;
    });
  }

  // prefixed with underscored because delete is a reserved word in javascript
  function _delete(id) {
    setFilterDevices((filterDevices) =>
      filterDevices.map((x) => {
        // add isDeleting prop to filterDevices being deleted
        if (x.id === id) return { ...x, isDeleting: true };

        return x;
      })
    );

    return fetchWrapper.delete(`${baseUrl}/${id}`).then(() => {
      // remove filterDevices from list after deleting
      setDeviceDetails((filterDevices) =>
        filterDevices.filter((x) => x.id !== id)
      );
    });
  }
}
