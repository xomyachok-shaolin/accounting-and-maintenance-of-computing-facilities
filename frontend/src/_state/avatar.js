import { atom } from 'recoil';

// import defaultImageSrc from '../assets/anonymous.png';

const avatarAtom = atom({
    key: 'avatar',
    default: null
});

export { avatarAtom };