import { atom } from 'recoil';

const deviceParametersAtom = atom({
    key: 'deviceParameters',
    default: null
});

const deviceParameterAtom = atom({
    key: 'deviceParameter',
    default: null
});

export { 
    deviceParametersAtom,
    deviceParameterAtom
};