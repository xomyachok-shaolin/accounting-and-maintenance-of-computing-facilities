import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { writtingOffActAtom, writtingOffActsAtom } from '_state';

export { useWrittingOffActActions };

function useWrittingOffActActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}/writtingOffActs`;
    const fetchWrapper = useFetchWrapper();
    const setWrittingOffAct = useSetRecoilState(writtingOffActAtom);
    const setWrittingOffActs = useSetRecoilState(writtingOffActsAtom);

    return {
        getAll,
        getById,
        create,
        update,
        delete: _delete,
        resetWrittingOffAct: useResetRecoilState(writtingOffActAtom),
        resetWrittingOffActs: useResetRecoilState(writtingOffActsAtom),
    }


    function create(writtingOffAct) {
        return fetchWrapper.post(`${baseUrl}/create`, writtingOffAct);
    }


    function getAll() {
        return fetchWrapper.get(baseUrl).then(setWrittingOffActs);
    }


    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setWrittingOffAct);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setWrittingOffAct(writtingOffActs => writtingOffActs.map(x => {
            // add isDeleting prop to deviceDetail being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove deviceDetail from list after deleting
                setWrittingOffAct(setWrittingOffActs => setWrittingOffActs.filter(x => x.id !== id));
            });
    }
}
