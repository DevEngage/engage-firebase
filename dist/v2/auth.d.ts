import * as firebase from 'firebase/app';
export default class EngageAuth {
    static instance: EngageAuth;
    private _auth;
    static user: any;
    static userId: any;
    static init(): void;
    static getInstance(config?: any, enablePersistence?: boolean): EngageAuth;
    static currentUser(): Promise<any>;
    static currentUserId(): Promise<any>;
    watchUser(cb: any): Promise<void>;
    getUserId(): Promise<string>;
    login(email: string, password: string): Promise<firebase.auth.UserCredential>;
    loginSocial(service: any, method: string, scope?: any, mobile?: boolean): Promise<void | firebase.auth.UserCredential>;
    signup(email: string, password: string): Promise<firebase.auth.UserCredential>;
    logout(): Promise<void>;
    sendEmailVerification(): Promise<any>;
    forgotPassword(email: string): Promise<void>;
    updatePassword(newPassword: any): Promise<any>;
    anonLogin(): Promise<firebase.User>;
    updateUserData(user: any): Promise<any>;
    updateProfile({ firstName, lastName, email }: {
        firstName: any;
        lastName: any;
        email: any;
    }): Promise<any>;
    getProfile(): Promise<any>;
}
