import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import './theme/variables.css';
import EngageFireState from './react/state';
import EngageFireContext from './react/context';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/login';



const App: React.FC = () => {

  const state = EngageFireState({
    testList: 'testList'
  });

  return (
      <EngageFireContext.Provider value={state}>
      <IonApp>
          <IonReactRouter>
              <IonRouterOutlet>
                  <Route path="/dashboard" component={Dashboard} exact={true}/>
                  <Route path="/login" component={Login} exact={true}/>
                  <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
              </IonRouterOutlet>
          </IonReactRouter>
      </IonApp>
      </EngageFireContext.Provider>
  );
};

export default App;
