import { atom } from 'recoil';

const locationsAtom = atom({
    key: 'locations',
    default: null
});

const locationAtom = atom({
    key: 'location',
    default: null
});

export { 
    locationsAtom,
    locationAtom
};