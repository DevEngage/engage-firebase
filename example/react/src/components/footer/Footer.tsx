import { IonFooter, IonTitle, IonToolbar, IonButtons, IonButton, IonText } from '@ionic/react';
import React from 'react';
import './footer.scss'

const Footer = () => {

    const CURRENT_YEAR = new Date().getFullYear();


    return (
        <IonFooter className="footer-component">
            <IonToolbar className="page-footer">
                    <IonButtons>
                        <IonButton className="footer-button" fill="clear">About Us</IonButton>
                        <IonButton className="footer-button" fill="clear">Link #2</IonButton>
                    </IonButtons>
                    <IonText className="footer-text" slot="end">© {CURRENT_YEAR}, made with <span className="footer-heart">♥</span> by Devengage.</IonText>
            </IonToolbar>
        </IonFooter>
    );
};

export default Footer;
