import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import EngageFireState from "./services/engageFireState.service";
import EngageFireContext from "./services/engageFireContext.service";


import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import GroupAdd from "./pages/groupAdd/GroupAdd";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.scss';
import './theme/global.scss';


const App = () => {

    const {user, isLoggedIn, hasLoaded} = EngageFireState();

    return (
        hasLoaded ?
            <EngageFireContext.Provider value={{user, isLoggedIn, hasLoaded}}>
                <IonApp>
                    <IonReactRouter>
                        <IonRouterOutlet>
                            <ProtectedRoute path='/dashboard' component={Dashboard} />
                            <ProtectedRoute path='/addgroup' component={GroupAdd} />
                            <ProtectedRoute path="/login" component={Login} exact={true} showWhenLoggedIn={false} redirect={'/dashboard'}/>
                            <Route exact={true} path="/" render={() => <Redirect to="/dashboard"/>}/>
                        </IonRouterOutlet>
                    </IonReactRouter>
                </IonApp>
            </EngageFireContext.Provider> : <></>
    );
};

export default App;


