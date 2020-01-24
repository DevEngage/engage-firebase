import {
    IonContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonImg,
    useIonViewWillEnter,
} from '@ionic/react';
import React, {useContext, useEffect, useState} from 'react';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import SectionHeader from "../../components/sectionHeader/SectionHeader";
import SectionItem from "../../components/sectionItem/SectionItem";
import {people} from "ionicons/icons";
import Face from '../../assets/icons/face.svg';
import People from '../../assets/icons/people.svg';
import Dumbbell from '../../assets/icons/dumbbell-outline.svg';
import AppleBadge from "../../assets/images/apple-appstore-badge.png"
import GoogleBadge from "../../assets/images/google-play-badge.png"
import "./dashboard.scss";
import Logo from "../../assets/images/logo_600.png";
import engageFirestore from "@dev-engage/firebase";
import EngageFireContext from "../../services/engageFireContext.service";
import {useHistory} from "react-router";


const Dashboard = () => {
    const history = useHistory();
    const [groups, setGroups] = useState(null);

    const fs = engageFirestore('groups');

    useIonViewWillEnter( async () => {
        // const groupData = await fs.getList({ filter: {'admins.array-contains': '{userId}' }});
        const groupData = await fs.getList({ filter: {'admins.arrayContains': '{userId}' }});
        setGroups(groupData);
    });

    const addGroup = () => {
        history.push('/addgroup', { direction: 'none' });
        console.log('addGroup hit');
    };

    const addPersonal = () => {
        console.log('addPersonal hit');
    };

    const stats = [
        {name: 'programs', amount: 4},
        {name: 'members', amount: 22}
    ];

  return (
          <IonPage>
              <Header />
              <IonContent className="content-area dashboard">
                  <IonButtons className="top-buttons">
                      <IonButton className="top-left-button" fill="clear">What's the difference?</IonButton>
                      <IonButton fill="clear">Getting started</IonButton>
                  </IonButtons>

                  <div className="section-wrapper">
                      <SectionHeader label="Groups" icon={people} addFunc={addGroup}></SectionHeader>
                      {groups && groups.length > 0 && groups.map((group) => (
                          <SectionItem key={group.$doc.$id} label={group.$doc.name} src={People} optionsFunc={addGroup} stats={stats}></SectionItem>
                          ))}
                  </div>

                  <div className="section-wrapper">
                      <SectionHeader label="Personal" src={Face} addFunc={addPersonal}></SectionHeader>
                      <SectionItem label="Program Name" src={Dumbbell} optionsFunc={addGroup}></SectionItem>
                      <SectionItem label="Program Name" src={Dumbbell} optionsFunc={addGroup}></SectionItem>
                  </div>

                  <div className="bottom-bar">
                      <div className="bottom-bar-wrapper">
                        <p className="bottom-bar-text">Message about why they should grab the app</p>
                          <div className="badge-logo-wrapper">
                              <IonImg className="badge-logo" src={AppleBadge}></IonImg>
                              <IonImg className="badge-logo" src={GoogleBadge}></IonImg>
                          </div>
                      </div>
                  </div>

              </IonContent>
              <Footer />
          </IonPage>
  );
};

export default Dashboard;
