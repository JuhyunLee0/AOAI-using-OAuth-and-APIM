import { memo } from 'react';
import { Table } from 'react-bootstrap';
import { createClaimsTable } from '../utils/claimUtils';

import '../styles/App.css';

const IdTokenData = (props) => {
    console.log('idTokenClaims start', props);
    const activeAccount = props.activeAccount;
    const tokenClaims = createClaimsTable(activeAccount.idTokenClaims);

    const tableRow = Object.keys(tokenClaims).map((key, index) => {
        return (
            <tr key={key}>
                {tokenClaims[key].map((claimItem) => (
                    <td key={claimItem}>{claimItem}</td>
                ))}
            </tr>
        );
    });
    
    return (
        <>
            <div className="data-area-div">
                <p>
                    See below the claims in your <strong> ID token </strong>. For more information, visit:{' '}
                    <span>
                        <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
                            docs.microsoft.com
                        </a>
                    </span>
                </p>
                <div className="data-area-div">
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Claim</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>{tableRow}</tbody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default memo(IdTokenData);