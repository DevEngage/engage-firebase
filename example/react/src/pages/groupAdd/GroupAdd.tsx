import React, {useContext, useState} from "react";
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
import "./groupAdd.scss";
import {arrowBack, create} from "ionicons/icons";
import {useHistory} from "react-router";
import {IGroup} from "../../interfaces";
import engageFirestore from "@dev-engage/firebase";
import IsRequired from "../../components/isRequired/IsRequired";
import EngageFireContext from "../../services/engageFireContext.service";

const GroupAdd = () => {

    const history = useHistory();
    const {user} = useContext(EngageFireContext);

    let group:IGroup = {
        name: '',
        legalName: '',
        description: '',
        type: '',
        admins: [],
    };

    const [formValues, setFormValues] = useState(group);
    const [errorMessage, setErrorMessage] = useState('');

    const customPopoverOptions = {
        cssClass: "popover-styling"
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
        data.admins.push(user.uid);
        await engageFirestore('groups').save(data);
        goBack();
        // if (!email) setEmailError('Email is required');
        // if (email && !validateEmail(email)) setEmailError('Must use a valid email address');
        // if (!password) setPasswordError('Password is required');
        // if (password && password.length < 8) setPasswordError('Password must be at least 8 characters');
        return;
    };

    const isValid = () => {
        if (!formValues.name || !formValues.description || !formValues.type) {
            setErrorMessage('You must fill in all the required fields before creating a group');
            return false;
        }
        else return true
    };

    const clearErrors = async () => {
        setErrorMessage('')
        return;
    };

    const onKeyPress = (e) => {
        if (e.keyCode == 13) submitForm(e);
        else clearErrors();
    };

    return (
        <IonPage>
            <IonContent className="content-area group-add">
                <div className="top-background-image"></div>
                <div className="top-back-button-wrapper">
                    <IonButton className="top-back-button" fill="clear" onClick={() => goBack()}><IonIcon icon={arrowBack}/></IonButton>
                </div>
                <div style={{minWidth: '300px', width: '90%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto'}}>
                    <div className="group-add-page-wrapper">
                        <div className="add-card">
                            <div className="add-card-header">
                                <IonItem lines="none" className="ion-text-center, ion-padding">
                                    <IonLabel>
                                        <IonIcon slot="start" icon={create}></IonIcon>
                                        Create Group
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
                                            <IonLabel position="fixed">Legal Name</IonLabel>
                                            <IonInput name="legalName" type="text" value={formValues.legalName}
                                                      onIonChange={e => inputHandler(e)}>
                                            </IonInput>
                                        </IonItem>

                                    <IonItem lines="none">
                                        <IonLabel position="fixed">Description<IsRequired/></IonLabel>
                                        <IonTextarea rows={2} autoGrow={true} name="description" value={formValues.description}
                                                  onIonChange={e => inputHandler(e)}>
                                        </IonTextarea>
                                    </IonItem>

                                    <IonItem className="ion-select-styling" lines="inset">
                                        <IonLabel>Type<IsRequired/></IonLabel>
                                        <IonSelect interfaceOptions={customPopoverOptions} interface="popover" name="type" onIonChange={e => inputHandler(e)} value={formValues.type} placeholder="Select One">
                                            <IonSelectOption value="business">Business</IonSelectOption>
                                            <IonSelectOption value="influencer">Influencer</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>

                                    {errorMessage && <IonText color="danger">
                                        <p className="error-message">
                                            {errorMessage}
                                        </p>
                                    </IonText>}

                                </IonList>

                                <IonRow>
                                    <IonButton className="add-submit-button" type="submit" size="default">Create Group</IonButton>
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

export default GroupAdd;
