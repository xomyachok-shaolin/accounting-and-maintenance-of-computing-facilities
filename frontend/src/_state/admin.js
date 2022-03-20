import { atom } from 'recoil';

const adminAtom = atom({
    key: 'admin',
    default: false
});

export { adminAtom };