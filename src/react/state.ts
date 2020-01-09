import { useEffect, useState } from "react";
import EngageAuth from "../auth";

function EngageFireState() {
    const engageAuth = new EngageAuth();

    const [user, setUser] = useState(null);
    const [hasLoaded, sethasLoaded] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const watchUser = (userData) => {
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

    return { user, isLoggedIn, hasLoaded }
}

export default EngageFireState
