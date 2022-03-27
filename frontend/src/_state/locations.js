import { atom } from 'recoil';

const locationsAtom = atom({
    key: 'roles',
    default: null
});

const locationAtom = atom({
    key: 'role',
    default: null
});

export { 
    locationsAtom,
    locationAtom
};