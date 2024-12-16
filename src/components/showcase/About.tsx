import React from 'react';
import me from '../../assets/pictures/workingAtComputer.jpg';
import meNow from '../../assets/pictures/currentme.jpg';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>This is BITCOIN</h3>
            <br />
            <div className="text-block">
                <p>
                I am pleased to announce the release of Bitcoin, a decentralized peer-to-peer electronic cash system designed to enable direct, secure, and trustless transactions without the need for intermediaries. This system addresses key challenges in digital payments, including inefficiency, high costs, and reliance on centralized authorities, by introducing a revolutionary technology: the blockchain.
                </p>
                <br />
                <p>
                The blockchain serves as a public, immutable ledger that records all transactions transparently while being collectively maintained by a network of participants. Using a proof-of-work mechanism, Bitcoin ensures the security and integrity of its network, preventing fraud and eliminating the need for centralized oversight. With a finite supply of 21 million coins, Bitcoin also introduces scarcity to protect against inflation and preserve long-term value.


                </p>
                <br />
                <p>
                    
The source code for Bitcoin is now available for review and further development. I invite experts and innovators to explore this project and contribute to its growth. I believe Bitcoin has the potential to transform how we perceive and exchange value, fostering a more transparent and equitable digital economy.
                </p>
                <br />
                <p>
                Sincerely,
                <br />
                Satoshi Nakamoto
                </p>
            </div>
            
        </div>
    );
};

const styles: StyleSheetCSS = {
    contentHeader: {
        marginBottom: 16,
        fontSize: 48,
    },
    image: {
        height: 'auto',
        width: '100%',
    },
    topImage: {
        height: 'auto',
        width: '100%',
        marginBottom: 32,
    },
    verticalImage: {
        alignSelf: 'center',
        marginLeft: 32,
        flex: 0.8,
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
    },
};

export default About;
