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
    IonLoading,
} from '@ionic/react';
import React, {useContext, useEffect, useState} from 'react';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import SectionHeader from "../../components/sectionHeader/SectionHeader";
import SectionItem from "../../components/sectionItem/SectionItem";
import {people, trash} from "ionicons/icons";
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
    const [programs, setPrograms] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [showLoading, setShowLoading] = useState(null);

    const {user} = useContext(EngageFireContext);

    const fsGroups = engageFirestore('groups');
    const fsPrograms = engageFirestore('programs');

    useIonViewWillEnter( async () => {
        getGroups();
        getPrograms();
    });

    useEffect(() => {
        console.log('activeId', activeId);
    }, [activeId]);

    const getGroups = async () => {
        if (user && user.uid) {
            const groupData = await fsGroups.getList({ filter: {'admins.arrayContains': '{userId}' }});
            setGroups(groupData);
        }
        return
    };

    const getPrograms = async () => {
        if (user && user.uid) {
            const programData = await fsPrograms.getList({ filter: {'userId.isEqualTo': '{userId}' }});
            setPrograms(programData);
        }
        return
    };

    const addGroup = () => {
        history.push('/addgroup', { direction: 'none' });
        console.log('addGroup hit');
    };

    const editGroup = (groupId) => {
        const group = groups.filter((group) => group.$doc.$id === groupId)[0];
        history.push(`/addgroup/${groupId}`, { direction: 'none', groupId: groupId, group: group.$doc});
        console.log('addGroup hit');
    };

    const deleteGroup = async (groupId) => {
        await fsGroups.remove(groupId);
        return
    };

    const addProgram = () => {
        history.push('/addprogram', { direction: 'none', isPersonal: true, userId: user.uid });
        console.log('addProgram hit');
    };

    const editProgram = (programId) => {
        const program = programs.filter((program) => program.$doc.$id === programId)[0];
        console.log('program', program);
        history.push(`/addprogram/${programId}`, { direction: 'none', programId: programId, program: program.$doc});
        console.log('editProgram hit');
    };

    const deleteProgram = async (programId) => {
        await fsPrograms.remove(programId);
        return
    };

    const stats = [
        {name: 'programs', amount: 4},
        {name: 'members', amount: 22}
    ];

    const groupOptionsData = [{
        text: 'Edit',
        role: 'edit',
        handler: async () => {
            console.log('edit group clicked', activeId);
            editGroup(activeId);
        }
    }, {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
            console.log('Delete group clicked', activeId);
            setShowLoading(true);
            await deleteGroup(activeId);
            await getGroups();
            setShowLoading(false);
        }
    }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
            console.log('Cancel clicked');
        }
    }];

    const programOptionsData = [{
        text: 'Edit',
        role: 'edit',
        handler: async () => {
            console.log('edit program clicked', activeId);
            editProgram(activeId);
        }
    }, {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
            console.log('Delete program clicked', activeId);
            setShowLoading(true);
            await deleteProgram(activeId);
            await getPrograms();
            setShowLoading(false);
        }
    }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
            console.log('Cancel clicked');
        }
    }];

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
                        <SectionItem key={group.$doc.$id} id={group.$doc.$id} setActiveId={setActiveId} label={group.$doc.name} src={People} optionsData={groupOptionsData}></SectionItem>
                    ))}
                </div>

                <div className="section-wrapper">
                    <SectionHeader label="Personal" src={Face} addFunc={addProgram}></SectionHeader>
                    {programs && programs.length > 0 && programs.map((program) => (
                        <SectionItem key={program.$doc.$id} id={program.$doc.$id} setActiveId={setActiveId} label={program.$doc.name} src={Face} optionsData={programOptionsData}></SectionItem>
                    ))}                  </div>

                <div className="bottom-bar">
                    <div className="bottom-bar-wrapper">
                        <p className="bottom-bar-text">Message about why they should grab the app</p>
                        <div className="badge-logo-wrapper">
                            <IonImg className="badge-logo" src={AppleBadge}></IonImg>
                            <IonImg className="badge-logo" src={GoogleBadge}></IonImg>
                        </div>
                    </div>
                </div>
                <IonLoading isOpen={showLoading} onDidDismiss={() => setShowLoading(false)} />
            </IonContent>
            <Footer />
        </IonPage>
    );
};

export default Dashboard;
