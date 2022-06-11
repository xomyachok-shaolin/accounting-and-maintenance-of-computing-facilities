import { atom } from 'recoil';

const workstationsAtom = atom({
    key: 'workstations',
    default: null
});

const workstationAtom = atom({
    key: 'workstation',
    default: null
});

const filterWorkstationsAtom = atom({
    key: 'filterWorkstations',
    default: null
});

const deviceTransfersAtom = atom({
    key: 'deviceTransfers',
    default: null
});

const workstationTransfersAtom = atom({
    key: 'workstationTransfers',
    default: null
});

export { 
    filterWorkstationsAtom,
    workstationsAtom,
    workstationAtom,
    deviceTransfersAtom,
    workstationTransfersAtom
};