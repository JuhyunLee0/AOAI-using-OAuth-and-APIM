/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import ChatBox from './components/ChatBox';
import IdTokenData from './components/DataDisplay';

import './styles/App.css';

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
  const [tokenObj, setTokenObj] = useState(null);

  const generateToken = async () => {
    const activeAccount = instance.getActiveAccount();

    let tk = '';
    let exp = '';

    if(activeAccount) {
        var request = {
            scopes: process.env.REACT_APP_OAUTH_SCOPE.split(','), // e.g. ["user.read"]
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
                        <button onClick={() => generateToken()}>Get Access Token</button>
                        {tokenObj ? (
                          <div style={{wordWrap: 'break-word'}}>
                            <p>
                                Expires: <br/> {tokenObj ? tokenObj.expiresOn : ""}<br/>
                                Token: <br/>{tokenObj ? tokenObj.token: ""}
                            </p>
                            <hr/>
                            <ChatBox tokenObj={tokenObj}/>
                          </div>
                        ) : null}
                        
                        <hr/>
                        <hr/>
                        <br/>
                        <IdTokenData activeAccount={activeAccount} />
                    </Container>
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see token information.</h5>
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
