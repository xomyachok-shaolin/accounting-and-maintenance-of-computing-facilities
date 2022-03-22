import { atom } from 'recoil';

const imageAtom = atom({
    key: 'image',
    default: null
});

export { imageAtom };