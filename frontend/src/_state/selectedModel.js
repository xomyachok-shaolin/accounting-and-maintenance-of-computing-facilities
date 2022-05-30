import { atom } from 'recoil';

const selectedModelAtom = atom({
    key: 'selectedModel',
    default: null
});

export { selectedModelAtom };