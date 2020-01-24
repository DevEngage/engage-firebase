import React, {useState, useEffect, useContext} from "react"
import { EngageAuth } from '@dev-engage/firebase';
import { useHistory } from "react-router-dom";



import './login.scss'
import Logo from '../../assets/images/logo_600.png'

import {IonIcon, IonImg, IonButton, IonList, IonItem, IonLabel, IonInput, IonText, IonRow, IonCol, IonPage, IonToast} from "@ionic/react"
import {person} from "ionicons/icons"

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formState, setFormState] = useState('');
    const [title, setTitle] = useState('');
    const [actionButton, setActionButton] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');


    const engageAuth = EngageAuth.getInstance();

    useEffect(() => {
        // console.log('history', history);
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
    }, [formState]);

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        await clearErrors();
        setFormSubmitted(true);
        if (!email) setEmailError('Email is required');
        if (email && !validateEmail(email)) setEmailError('Must use a valid email address');
        if (!password) setPasswordError('Password is required');
        if (password && password.length < 8) setPasswordError('Password must be at least 8 characters');
        if (formState === "create" && confirmPassword !== password) setConfirmPasswordError(true);
        if (formState === "login" && email && password && password.length >= 8 && validateEmail(email)) login();
        if (formState === "forgot" && email && validateEmail(email)) forgot();
        if (formState === "create" && email && validateEmail(email) && password && password.length >= 8 && confirmPassword && password === confirmPassword) create();
        return;
    };

    const login = async () => {
        try {
            await engageAuth.login(email, password);
            // await clearForm();
            // setToastMessage('You have successfully logged in.');
            // setShowToast(true);
            // history.push('/dashboard', { direction: 'none' });
        } catch (error) {
            setToastMessage(error.message);
            setShowToast(true);
        }

    };

    const create = async () => {
        try {
            await engageAuth.signup(email, password);
            // clearForm();
            // setToastMessage("You're new account has been setup successfully");
            // setShowToast(true);
            // history.push('/dashboard', { direction: 'none' });
        } catch (error) {
            setToastMessage(error.message);
            setShowToast(true);
        }
    };

    const forgot = async () => {
        try {
            await engageAuth.forgotPassword(email);
            setToastMessage("You're reset password email has been sent.");
            setShowToast(true);
            clearForm();
        } catch (error) {
            setToastMessage(error.message);
            setShowToast(true);
        }
    };

    const clearErrors = async () => {
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError(false);
        return;
    };

    const clearForm = async () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return;
    };

    const onKeyPress = (e) => {
        if (e.keyCode == 13) submitForm(e);
        else clearErrors();
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    return (
            <IonPage className="login-page">
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
                            <form noValidate onSubmit={submitForm} onKeyDown={onKeyPress}>
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
                                            {emailError}
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
                                                {passwordError}
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
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => {setShowToast(false); setToastMessage('')}}
                    message={toastMessage}
                    duration={4000}
                />
            </IonPage>
    );
};

export default Login
