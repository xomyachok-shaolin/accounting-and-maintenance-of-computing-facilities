import { atom } from 'recoil';

const writtingOffActsAtom = atom({
    key: 'writtingOffActs',
    default: null
});

const writtingOffActAtom = atom({
    key: 'writtingOffAct',
    default: null
});

export {
    writtingOffActsAtom,
    writtingOffActAtom
};