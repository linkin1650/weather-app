import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import firebase from "firebase";
import firebaseui from "firebaseui";

const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: "select_account",
      },
    },
  ],
});

if (ui.isPendingRedirect()) {
  ui.start("#firebaseui-auth-container", uiConfig);
}
