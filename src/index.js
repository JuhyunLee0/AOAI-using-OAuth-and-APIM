import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(msalConfig);


// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
    console.log(msalInstance.getActiveAccount()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        console.log('%c Token', 'background: #222; color: #bada55');
        console.log('event.payload', event.payload);
        console.log(`%c ${event.payload.idToken}`, 'background: #222; color: skyblue')
        // console.log('Id Token', event.payload.idToken);
        // this is to temporarily display the login token, remove this after getting Entra ID app setup
        window.top.msaltoken = event.payload.idToken;
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App instance={msalInstance}/>);
