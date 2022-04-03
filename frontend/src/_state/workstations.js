import { atom } from 'recoil';

const workstationsAtom = atom({
    key: 'workstations',
    default: null
});

const workstationAtom = atom({
    key: 'workstation',
    default: null
});

export { 
    workstationsAtom,
    workstationAtom
};