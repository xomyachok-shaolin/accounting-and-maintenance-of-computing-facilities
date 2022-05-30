import { atom } from 'recoil';

const deviceDetailsAtom = atom({
    key: 'deviceDetails',
    default: null
});

const deviceDetailAtom = atom({
    key: 'deviceDetail',
    default: null
});

const filterParametersAtom = atom({
    key: 'filterParameters',
    default: null
});

const filterDevicesAtom = atom({
    key: 'filterDevices',
    default: null
});

export {
    deviceDetailsAtom,
    deviceDetailAtom,
    filterParametersAtom,
    filterDevicesAtom
};