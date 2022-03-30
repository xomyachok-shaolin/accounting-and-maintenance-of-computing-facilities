import { atom } from 'recoil';

const deviceTypesAtom = atom({
    key: 'deviceTypes',
    default: null
});

const deviceTypeAtom = atom({
    key: 'deviceType',
    default: null
});

export { 
    deviceTypesAtom,
    deviceTypeAtom
};