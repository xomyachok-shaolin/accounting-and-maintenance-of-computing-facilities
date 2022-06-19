import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from '_state';

export { Home };

function Home() {
    const auth = useRecoilValue(authAtom);

    return (
        <div className="p-4">
            <div className="container">
                <h1>Привет {auth?.username}!</h1>
                            </div>
        </div>
    );
}
