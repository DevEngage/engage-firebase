import EngageFire from './engagefire';
import * as firebase from 'firebase/app';

export default class EngageAuth {
    user;
    userId;

    /* 
      AUTH (FrontEnd)
    */
    async watchUser(cb: any) {
        await EngageFire.ready();
        EngageFire.auth.onAuthStateChanged((user) => {
            if (cb) cb(user || null);
            this.user = user;
            if (user && user.uid) {
                this.userId = user.uid;
            }
        });
    }

    async getUserId(): Promise<string> {
        await EngageFire.ready();
        if (this.userId) {
            return this.userId;
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

}