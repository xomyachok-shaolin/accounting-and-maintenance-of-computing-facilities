import { useSetRecoilState, useResetRecoilState, useRecoilState } from "recoil";

import { useFetchWrapper } from "_helpers";
import {
  deviceDetailsAtom,
  deviceDetailAtom,
  filterParametersAtom,
  filterDevicesAtom,
  selectedModelAtom,
} from "_state";

export { useDeviceDetailActions };

function useDeviceDetailActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/deviceDetails`;
  const fetchWrapper = useFetchWrapper();
  const setDeviceDetails = useSetRecoilState(deviceDetailsAtom);
  const setDeviceDetail = useSetRecoilState(deviceDetailAtom);
  const setFilterParameters = useSetRecoilState(filterParametersAtom);
  const setFilterDevices = useSetRecoilState(filterDevicesAtom);
  const [selectedModel, setSelectedModel] = useRecoilState(selectedModelAtom);

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
    return fetchWrapper.get(baseUrl).then((dd) => {
      setDeviceDetails(dd);

      var selected = null;
      dd.forEach((dt) => {
        dt.deviceModels.forEach((dm) => {
          if (dm.id == selectedModel?.dm?.id) {
            selected = dm;
            const d = JSON.parse(JSON.stringify(dm.devices));
            d.forEach(device => {
                device.deviceModel = dm.name
            });
            setFilterDevices(d);
        }
        });
      });

      var parameters = [];
      selected?.deviceParameterValues.forEach((dp) => {
        parameters.push({
          key: dp.deviceParameter.id,
          name: dp.deviceParameter.name,
          description: dp.value,
          deviceModel: selectedModel?.deviceModel,
          deviceType: selectedModel?.deviceType,
        });
      });

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
