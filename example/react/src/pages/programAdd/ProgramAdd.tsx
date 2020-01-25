import React, {useContext, useEffect, useState} from "react";
import {
    IonPage,
    IonContent,
    IonIcon,
    IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonInput,
    IonText,
    IonRow,
    IonCol,
    IonTextarea,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import Footer from "../../components/footer/Footer";
import "./programAdd.scss";
import {arrowBack, create, attach, camera, add} from "ionicons/icons";
import {useHistory} from "react-router";
import {IProgram} from "../../interfaces";
import engageFirestore from "@dev-engage/firebase";
import IsRequired from "../../components/isRequired/IsRequired";
import EngageFireContext from "../../services/engageFireContext.service";
import Dumbbell from '../../assets/icons/dumbbell-thick.svg';


const ProgramAdd = ({match}) => {

    // console.log('match', match);
    const history = useHistory();
    const {user} = useContext(EngageFireContext);
    // console.log('history', history);

    let program:IProgram = {};
    let userId = '';
    let groupId = '';
    let isPersonal = false;
    const fsPrograms = engageFirestore('programs');

    if (history.location.state.userId) userId = history.location.state.userId;
    if (history.location.state.groupId) groupId = history.location.state.groupId;
    if (history.location.state.isPersonal) isPersonal = history.location.state.isPersonal;
    if (history.location.state.program) program = history.location.state.program;
    else {
        program = {
            name: '',
            description: '',
            price: 0,
            tags: [],
        };
    }

    const [programDoc, setProgramDoc] = useState(null) ;
    const [formValues, setFormValues] = useState(program);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect( () => {getProgramDoc()}, []);

    const customPopoverOptions = {
        cssClass: "popover-styling"
    };

    const getProgramDoc = async () => {
        let docData = null;
        if (program.$id) docData = await fsPrograms.getOnce(program.$id);
        else docData = await fsPrograms.save({});
        setProgramDoc(docData);
    };

    const inputHandler = (e) => {
        // e.persist();
        // console.log('e', e);
        // setErrorMessage('');
        setFormValues(currentValues => ({
            ...currentValues,
            [e.target.name]: e.target.value
        }))
        // console.log('group', group);
    };

    const goBack = () => {
        history.goBack();
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        await clearErrors();
        if (!isValid()) return;
        let data = formValues;
        if (userId) data.userId = userId;
        if (groupId) data.groupId = groupId;
        if (isPersonal) data.isPersonal = isPersonal;
        if (data.price) data.price = Number(data.price);
        await engageFirestore('programs').save(data);
        goBack();
        // if (!email) setEmailError('Email is required');
        // if (email && !validateEmail(email)) setEmailError('Must use a valid email address');
        // if (!password) setPasswordError('Password is required');
        // if (password && password.length < 8) setPasswordError('Password must be at least 8 characters');
        return;
    };

    const isValid = () => {
        if (!formValues.name || !formValues.description) {
            setErrorMessage('You must fill in all the required fields before creating a group');
            return false;
        }
        else return true
    };

    const clearErrors = async () => {
        setErrorMessage('');
        return;
    };

    const onKeyPress = (e) => {
        console.log('programDoc', programDoc);
        if (e.keyCode == 13) submitForm(e);
        else clearErrors();
    };

    const setImage = () => {
        console.log('programDoc', programDoc);
        programDoc.$setImage();
    };

    return (
        <IonPage>
            <IonContent className="content-area program-add">
                <div className="top-background-image"></div>
                <div className="top-back-button-wrapper">
                    <IonButton className="top-back-button" fill="clear" onClick={() => goBack()}><IonIcon icon={arrowBack}/></IonButton>
                </div>
                <div style={{minWidth: '300px', width: '90%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto'}}>
                    <div>
                        <div className="add-card">
                            <div className="add-card-header">
                                <IonItem lines="none" className="ion-text-center, ion-padding">
                                    <IonLabel>
                                        <IonIcon slot="start" icon={create}></IonIcon>
                                        {program.$id ? 'Edit Program' : 'Create Program'}
                                    </IonLabel>
                                </IonItem>
                            </div>
                            <form noValidate onSubmit={submitForm} onKeyDown={onKeyPress}>
                                <IonList>
                                    <IonItem lines="none">
                                        <IonLabel position="fixed">Name<IsRequired/></IonLabel>
                                        <IonInput name="name" type="text" value={formValues.name} spellCheck={false} autocapitalize="off"
                                                  onIonChange={e => inputHandler(e)}
                                                  required>
                                        </IonInput>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <IonLabel position="fixed">Price<IsRequired/></IonLabel>
                                        <IonInput name="price" type="number" value={formValues.price.toString()} spellCheck={false} autocapitalize="off"
                                                  onIonChange={e => inputHandler(e)}
                                                  required>
                                        </IonInput>
                                    </IonItem>

                                    <IonItem lines="none">
                                        <IonLabel position="fixed">Description<IsRequired/></IonLabel>
                                        <IonTextarea rows={2} autoGrow={true} name="description" value={formValues.description}
                                                  onIonChange={e => inputHandler(e)}>
                                        </IonTextarea>
                                    </IonItem>

                                    <IonItem className="ion-select-styling" lines="inset">
                                        <IonLabel>Tags</IonLabel>
                                        <IonSelect interfaceOptions={customPopoverOptions} multiple={true} interface="popover" name="tags" onIonChange={e => inputHandler(e)} value={formValues.tags} placeholder="Select">
                                            <IonSelectOption value="cardio">Cardio</IonSelectOption>
                                            <IonSelectOption value="weights">Weights</IonSelectOption>
                                            <IonSelectOption value="intense">Intense</IonSelectOption>
                                            <IonSelectOption value="light">Light</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>

                                    {errorMessage && <IonText color="danger">
                                        <p className="error-message">
                                            {errorMessage}
                                        </p>
                                    </IonText>}

                                </IonList>

                                <div className="image-row">
                                    <div onClick={() => setImage()}>
                                        <div className="image-wrapper">
                                            <IonIcon className="start-icon" src={Dumbbell}></IonIcon>
                                        </div>
                                        <span className="image-text"><IonIcon icon={camera}/><span>select image</span></span>
                                    </div>
                                    <div>
                                        <div className="image-wrapper">
                                            <IonIcon className="start-icon" icon={attach}></IonIcon>
                                        </div>
                                        <span className="image-text"><IonIcon icon={add}/><span>add docs</span></span>
                                    </div>
                                </div>

                                <IonRow>
                                    <IonButton className="add-submit-button" type="submit" size="default">{program.$id ? 'Edit Program' : 'Create Program'}</IonButton>
                                </IonRow>
                            </form>
                        </div>
                    </div>
                </div>

            </IonContent>
            <Footer />
        </IonPage>
    );
};

export default ProgramAdd;
