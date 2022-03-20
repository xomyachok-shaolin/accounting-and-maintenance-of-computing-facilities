import { atom } from 'recoil';

const submitAtom = atom({
    key: 'submit',
    default: false
});

export { submitAtom };