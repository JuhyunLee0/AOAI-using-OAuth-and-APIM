/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useState } from 'react';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import { IdTokenData } from './components/DataDisplay';

import './styles/App.css';



/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
    const [tokenObj, setTokenObj] = useState({
        token: '',
        expiresOn: '',
    });
    const [apiResponse, setApiResponse] = useState('');

    const handleClick = async (param1, param2) => {
        // Your async code here
        console.log('doing stuff');

        const activeAccount = instance.getActiveAccount();

        let tk = '';
        let exp = '';

        if(activeAccount) {
            var request = {
                scopes: ["User.Read"],
            };

            let tokenResponse = await instance.acquireTokenSilent(request);
            console.log('tokenResponse', tokenResponse);
            if(tokenResponse) {
                console.log('tokenResponse' ,tokenResponse);
                tk = tokenResponse.idToken;
                // tk = tokenResponse.accessToken;
                exp = tokenResponse.expiresOn;
                console.log(typeof exp, exp);
            }
        }
        setTokenObj({token: tk, expiresOn: `${exp.toLocaleDateString()}  ${exp.toLocaleTimeString()}`});
    };

    const callingAPIM = async () => {
        const headers = {
            Accept: "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenObj.token}`,
            // "User-Agent": "any-name"
        };

        const raw = JSON.stringify({
            "model": "gpt-35-turbo",
            "messages": [
                {
                "role": "user",
                "content": "Hello!"
                }
            ]
        });

        const requestOptions = {
            method: "POST",
            headers,
            body: raw,
        };

        let resp = null;
        try {
            resp = await fetch("https://jhl-apim.azure-api.net/deployments/jh-chatgpt35turbo/chat/completions?api-version=2023-05-15", requestOptions);
        } catch (error) {
            console.log('error', error);
            alert('Error calling API');
            return;
        }
        console.log('resp', resp);

        if(resp.ok) {
            let data = await resp.json();
            console.log(data);
            setApiResponse(JSON.stringify(data, null, 2));
        }else{
            console.log('error', resp);
            setApiResponse(resp.status);
        }
        
    };





    const MainContent = () => {
        /**
         * useMsal is a hook that returns the PublicClientApplication instance.
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
         */
        const { instance } = useMsal();
        const activeAccount = instance.getActiveAccount();
    
        /**
         * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
         * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
         * only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
         */
        return (
            <div className="App">
                <AuthenticatedTemplate>
                    {activeAccount ? (
                        <Container>
                            <hr/>
                            <button onClick={() => handleClick(instance)}>Get Access Token</button>
                            <div>
                                <p>
                                    Expires: <br/> {tokenObj.expiresOn}<br/><br/>
                                    Token: <br/>{tokenObj.token}
                                </p>
                                <button onClick={() => callingAPIM()}>Call AOAI via APIM</button>
                                <div>
                                    <p>API Response:</p>
                                    <p>{apiResponse}</p>
                                </div>
                            </div>
                            <hr/>
                            <br/><br/>
                            <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                        </Container>
                    ) : null}
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <h5 className="card-title">Please sign-in to see your profile information.</h5>
                </UnauthenticatedTemplate>
            </div>
        );
    };
    

    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <MainContent />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;
