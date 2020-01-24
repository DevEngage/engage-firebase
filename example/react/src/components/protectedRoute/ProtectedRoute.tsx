import React, {useContext, useEffect, useState} from "react"
import {Redirect, Route, useHistory} from "react-router-dom";
import EngageFireContext from "../../services/engageFireContext.service";

const ProtectedRoute = ({ component: Component, showWhenLoggedIn = true, redirect = '/login', ...rest }) => {
    const history = useHistory();

    const [authChecked, setAuthChecked] = useState(false);


    // Custom Auth Guard for Routes
    const {hasLoaded, isLoggedIn} = useContext(EngageFireContext);
    useEffect( () => {
        // if (hasLoaded && showWhenLoggedIn && !isLoggedIn) {history.push('/login', { direction: 'none' });}
        // if (hasLoaded && !showWhenLoggedIn && isLoggedIn) {history.push('/dashboard', { direction: 'none' });}
        setAuthChecked(true);
    }, [isLoggedIn, hasLoaded]);

    return (authChecked ? <Route {...rest} render={(props) => (
            (isLoggedIn && showWhenLoggedIn) ? <Component {...props} /> :
                (isLoggedIn && !showWhenLoggedIn) ? <Redirect to={redirect} /> :
                    (!isLoggedIn && showWhenLoggedIn) ? <Redirect to={redirect} /> :
                        (!isLoggedIn && !showWhenLoggedIn) ? <Component {...props} /> : <></>
        )} /> : <></>
    )
};

export default ProtectedRoute
