import { atom } from 'recoil';

const deviceDetailsAtom = atom({
    key: 'deviceDetails',
    default: null
});

const deviceDetailAtom = atom({
    key: 'deviceDetail',
    default: null
});

export {
    deviceDetailsAtom,
    deviceDetailAtom
};