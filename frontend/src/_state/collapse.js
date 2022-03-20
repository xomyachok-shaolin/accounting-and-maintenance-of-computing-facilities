import { atom } from 'recoil';

const collapseAtom = atom({
    key: 'collapse',
    default: false
});

export { collapseAtom };