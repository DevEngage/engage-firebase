import React, {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import EngageFireContext from "../../services/engageFireContext.service";

const AuthGuard = ({ children, showWhenLoggedIn }) => {
    const history = useHistory();

    const [authChecked, setAuthChecked] = useState(false);


    // Custom Auth Guard
    const {hasLoaded, isLoggedIn} = useContext(EngageFireContext);
    useEffect( () => {
        if (hasLoaded && showWhenLoggedIn && !isLoggedIn) {history.push('/login', { direction: 'none' });}
        if (hasLoaded && !showWhenLoggedIn && isLoggedIn) {history.push('/dashboard', { direction: 'none' });}
        setAuthChecked(true);
        console.log('authChecked', authChecked);
    }, [isLoggedIn, hasLoaded]);

    return (
        authChecked ? <>{children}</> : <></>
    )
};

export default AuthGuard
