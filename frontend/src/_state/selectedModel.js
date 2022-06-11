import { atom } from 'recoil';

const selectedModelAtom = atom({
    key: 'selectedModel',
    default: null
});


const flagUpdateAtom = atom({
    key: 'flagUpdate',
    default: null
});

export { selectedModelAtom, flagUpdateAtom};