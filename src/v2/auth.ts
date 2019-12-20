import EngageFire from './engagefire';
import * as firebase from 'firebase/app';
import EngageFirestore from './firestore';
import EngageDoc from './doc';

export default class EngageAuth {
    static instance: EngageAuth;
    private _auth = EngageFire.auth;
    static user;
    static userId;

    static init()  {
        if (EngageFire.auth && EngageFire.auth.currentUser) {
            EngageAuth.user = EngageFire.auth.currentUser
        } else {
            EngageAuth.user = EngageFire.user;
        }
    }

    static getInstance(config?: any, enablePersistence?: boolean) {
        if (!EngageAuth.instance) {
            EngageAuth.instance = new EngageAuth();
            EngageAuth.init()
        }
        return EngageAuth.instance;
    }

    static async currentUser() { return EngageAuth.user || EngageFire.auth.currentUser }
    static async currentUserId() { return EngageAuth.user ? EngageAuth.user.uid : (await EngageAuth.currentUser()).uid }

    /* 
      AUTH (FrontEnd)
    */
    async watchUser(cb: any) {
        await EngageFire.ready();
        EngageFire.auth.onAuthStateChanged((user) => {
            if (cb) cb(user || null);
            EngageAuth.user = user;
            if (user && user.uid) {
                EngageAuth.userId = user.uid;
            }
        });
    }

    async getUserId(): Promise<string> {
        await EngageFire.ready();
        if (EngageAuth.userId) {
            return EngageAuth.userId;
        }
        if (EngageFire.user && EngageFire.user.uid) {
            return EngageFire.user.uid;
        }
        return null;
    }

    async login(email: string, password: string) {
        return await EngageFire.auth.signInWithEmailAndPassword(email, password);
    }

    async loginSocial(service: any, method: string, scope?: any, mobile = false) {
        console.log('isMobile', mobile);
        let provider: any;
        switch (service) {
            case 'google':
                provider = new firebase.auth.GoogleAuthProvider();
                break;
            case 'twitter':
                provider = new firebase.auth.TwitterAuthProvider();
                break;
            case 'facebook':
                provider = new firebase.auth.FacebookAuthProvider();
                break;
            case 'github':
                provider = new firebase.auth.GithubAuthProvider();
                break;
            default:
                provider = new firebase.auth.GoogleAuthProvider();
        }

        if (provider) provider.addScope(scope);

        if (method === 'popup') {
            return await EngageFire.auth.signInWithPopup(provider);
        } else {
            return await EngageFire.auth.signInWithRedirect(provider);
        }
    }

    async signup(email: string, password: string) {
        return await EngageFire.auth.createUserWithEmailAndPassword(email, password);
    }

    async logout() {
        return await EngageFire.auth.signOut();
    }

    async sendEmailVerification() {
        return await (<any>EngageFire.auth).sendEmailVerification();
    }

    async forgotPassword(email: string) {
        return await EngageFire.auth.sendPasswordResetEmail(email);
    }

    async updatePassword(newPassword: any) {
        return await (<any>EngageFire.auth).updatePassword(newPassword);
    }

    async anonLogin()  {
        var user = await this._auth.signInAnonymously();
        await this.updateUserData(user.user);
        return user.user;
    }

    async updateUserData(user) {
        return EngageFirestore.getInstance('reports').save({
            '$id': user.uid,
            'lastActivity': Date.now()
        });

    }

    async updateProfile({ firstName, lastName, email }) {
        let user = await EngageAuth.currentUser();
        let reportRef: EngageDoc = await EngageFirestore.getInstance('profile').get<EngageDoc>(user.uid);
        reportRef.$doc = {
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            '$updatedAt': Date.now()
        };
        return reportRef.$save();
    }

    async getProfile() {
        var user = await EngageAuth.currentUser();
        return EngageFirestore.getInstance('profile').get(user.uid);
    }

}