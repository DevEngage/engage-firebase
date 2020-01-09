import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFab, IonFabButton, IonIcon, IonList, IonItem } from '@ionic/react';
import React, {useContext, useEffect} from 'react';
import { EngageAuth } from '@dev-engage/firebase';
import EngageFireContext from "../../react/context";

const Dashboard = ({history}) => {

    // Custom Auth Guard
    const {hasLoaded, isLoggedIn, testList} = useContext(EngageFireContext);
    console.log(testList);
    // testList.getList();
    useEffect( () => {
        if (hasLoaded && !isLoggedIn) {
            console.log('isLoggedIn', isLoggedIn);
            console.log('history', history);
            history.push('/login', { direction: 'none' });
        }
    }, [isLoggedIn, hasLoaded, testList]);

    const engageAuth = new EngageAuth();

    const logout = async () => {
        await engageAuth.logout();
        // history.push('/login', { direction: 'none' })
    };

  // const buildList = testList.list.map(() => 
  //   <IonItem>
  //     <IonTitle>test</IonTitle>
  //   </IonItem>
  // );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          <IonButton slot="end" onClick={() => logout()}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon name="add" />
          </IonFabButton>
        </IonFab>
        <IonList>
          {/* {buildList} */}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
