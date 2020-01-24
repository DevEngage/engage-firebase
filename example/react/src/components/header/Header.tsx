import {IonButton, IonButtons, IonHeader, IonIcon, IonImg, IonTitle, IonToolbar} from '@ionic/react';
import React from 'react';
import {EngageAuth} from "@dev-engage/firebase";
import {useHistory} from "react-router-dom";
import './header.scss'
import Logo from '../../assets/images/logo_600.png'
import {contact, notifications} from "ionicons/icons"


const Header = () => {
    const history = useHistory();
    const engageAuth = new EngageAuth();

    const logout = async () => {
        console.log('hit logout');
        await engageAuth.logout();
        history.push('/login', { direction: 'none' })
    };

    return (
        <IonHeader className="header-component">
            <IonToolbar className="page-header">
                <IonImg slot="start" className="header-image-logo" src={Logo}></IonImg>
                <IonButtons slot="end" className="ion-padding-end">
                    <IonButton fill="clear"><IonIcon className="header-icon" icon={notifications} /></IonButton>
                    <IonButton fill="clear" onClick={() => logout()}><IonIcon className="header-icon" icon={contact} /></IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>

    );
};

export default Header;
