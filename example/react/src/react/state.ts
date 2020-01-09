import { useEffect, useState } from "react"
import { EngageAuth, EngageFirestore } from '@dev-engage/firebase';

function EngageFireState(collections: any) {
    const engageAuth = new EngageAuth();
    let built: any = {};
    for(const key in collections) {
        if (collections.hasOwnProperty(key)) {
            const element = collections[key];
            built[key] = EngageFirestore.getInstance(element);
        }
    }

    const [user, setUser] = useState(null);
    const [hasLoaded, sethasLoaded] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const watchUser = (userData: any) => {
        console.log('userData', userData);
        setUser(userData);
        if (userData && userData.uid) {setIsLoggedIn(true)}
        else setIsLoggedIn(false);
        if (!hasLoaded) sethasLoaded(true);
    };
    engageAuth.watchUser(watchUser);

    useEffect(() => {
        console.log('user', user);
    }, [user]);

    return { user, isLoggedIn, hasLoaded, ...built }
}

export default EngageFireState
