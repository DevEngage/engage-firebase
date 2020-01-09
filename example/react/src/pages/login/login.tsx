import React, { useState, useEffect } from "react"

import './login.scss'
import Logo from '../../assets/images/logo_600.png'

import {IonIcon, IonImg, IonButton, IonList, IonItem, IonLabel, IonInput, IonText, IonRow, IonCol} from "@ionic/react"
import {person} from "ionicons/icons"

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formState, setFormState] = useState('');
    const [title, setTitle] = useState('');
    const [actionButton, setActionButton] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    useEffect(() => {
        setFormState('login');
        setTitle('Login');
        setActionButton('Get Started');
    }, []);

    useEffect(() => {
        switch (formState) {
            case 'login':
                setTitle('Login');
                setActionButton('Get Started');
                break;
            case 'forgot':
                setTitle('Forgot Password');
                setActionButton('Reset Password');
                break;
            case 'create':
                setTitle('Signup');
                setActionButton('Create Account');
                break;
            default:
                setTitle('Login');
                setActionButton('Get Started');
                break;
        }

        // console.log("formState", formState)
    }, [formState]);

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setFormSubmitted(true);
        if (!email) {
            setEmailError(true);
        }
        if (!password) {
            setPasswordError(true);
        }
        if (formState === "create" && confirmPassword !== password) {
            setConfirmPasswordError(true);
        }

        if (email && password) {
            // await setIsLoggedIn(true);
            // await setUsernameAction(username);
            // history.push('/tabs/schedule', { direction: 'none' });
        }
    };

    return (
        <div className="login-page-wrapper" style={{}}>
            <div style={{minWidth: '300px', width: '90%', maxWidth: '550px'}}>
                <IonImg className="login-image-logo" src={Logo}></IonImg>

                <div className="login-card">
                    <div className="login-card-header">
                        <IonItem lines="none" className="ion-text-center, ion-padding">
                            <IonLabel>
                                <IonIcon slot="start" icon={person}></IonIcon>
                                {title}
                            </IonLabel>
                        </IonItem>
                    </div>
                    <form noValidate onSubmit={login}>
                        <IonList>
                            <IonItem>
                                <IonLabel position="floating" color="medium">Email</IonLabel>
                                <IonInput name="email" type="text" value={email} spellCheck={false} autocapitalize="off"
                                          onIonChange={e => setEmail(e.detail.value!)}
                                          required>
                                </IonInput>
                            </IonItem>

                            {formSubmitted && emailError && <IonText color="danger">
                                <p className="ion-padding-start">
                                    Email is required
                                </p>
                            </IonText>}

                            {formState !=="forgot" && <div>
                                <IonItem>
                                    <IonLabel position="floating" color="medium">Password</IonLabel>
                                    <IonInput name="password" type="password" value={password}
                                              onIonChange={e => setPassword(e.detail.value!)}>
                                    </IonInput>
                                </IonItem>

                                {formSubmitted && passwordError && <IonText color="danger">
                                    <p className="ion-padding-start">
                                        Password is required
                                    </p>
                                </IonText>}
                            </div>}

                            {formState ==="create" && <div>
                                <IonItem>
                                    <IonLabel position="floating" color="medium">Confirm Password</IonLabel>
                                    <IonInput name="confirmPassword" type="password" value={confirmPassword}
                                              onIonChange={e => setConfirmPassword(e.detail.value!)}>
                                    </IonInput>
                                </IonItem>

                                {formSubmitted && confirmPasswordError && <IonText color="danger">
                                    <p className="ion-padding-start">
                                        Passwords do not match
                                    </p>
                                </IonText>}
                            </div>}
                        </IonList>

                        <IonRow>
                            <IonButton className="login-submit-button" type="submit" size="default">{actionButton}</IonButton>
                        </IonRow>

                        <IonRow>
                            {formState !== 'login' && <IonCol className="ion-text-center">
                                <IonButton onClick={() => setFormState('login')} fill="clear" >Login</IonButton>
                            </IonCol> }
                            {formState !== 'forgot' && <IonCol className="ion-text-center">
                                <IonButton onClick={() => setFormState('forgot')} fill="clear" >Forgot Password</IonButton>
                            </IonCol> }
                            {formState !== 'create' && <IonCol className="ion-text-center">
                                <IonButton onClick={() => setFormState('create')} fill="clear" >Create Account</IonButton>
                            </IonCol> }
                        </IonRow>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
