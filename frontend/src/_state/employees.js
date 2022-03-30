import { atom } from 'recoil';

const employeesAtom = atom({
    key: 'employees',
    default: null
});

const employeeAtom = atom({
    key: 'employee',
    default: null
});

export { 
    employeesAtom,
    employeeAtom
};