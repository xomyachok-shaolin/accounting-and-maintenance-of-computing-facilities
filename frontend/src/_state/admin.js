import { atom } from 'recoil';

const adminAtom = atom({
    key: 'admin',
    // get initial state from local storage to enable user to stay logged in
    default: false
});

export { adminAtom };