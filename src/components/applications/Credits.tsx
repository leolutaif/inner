import React, { useEffect, useState } from 'react';
import Window from '../os/Window';
import { useInterval } from 'usehooks-ts';
import { motion } from 'framer-motion';

export interface CreditsProps extends WindowAppProps {}

const CREDITS = [
    {
        title: 'Engineering & Design',
        rows: [['ROOM', 'All']],
    },
    {
        title: 'Modeling & Texturing',
        rows: [
            ['ROOM', 'Texturing, Composition, & UV'],
            ['Mickael Boitte', 'Computer Model'],
            ['Sean Nicolas', 'Environment Models'],
        ],
    },
    {
        title: 'Sound Design',
        rows: [
            ['ROOM', 'Mixing, Composition, & Foley'],
            ['Sound Cassette', 'Office Ambience'],
            ['Windows 95 Startup Sound', 'Microsoft'],
        ],
    },
    {
        title: 'Special Thanks',
        rows: [
            ['Bruno Simon', 'SimonDev'],
            ['Lorelei Kravinsky', 'Scott Bass'],
            ['Trey Briccetti', 'Mom, Dad & Angela'],
        ],
    },
    {
        title: 'Inspiration',
        rows: [
            ['Bruno Simon', 'Jesse Zhou'],
            ['Pink Yellow', 'Vivek Patel'],
        ],
    },
];

const Credits: React.FC<CreditsProps> = (props) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [time, setTime] = useState(0);

    // every 5 seconds, move to the next slide
    useInterval(() => {
        setTime(time + 1);
        // setCurrentSlide((currentSlide + 1) % CREDITS.length);
    }, 1000);

    useEffect(() => {
        if (time > 5) {
            setCurrentSlide((currentSlide + 1) % CREDITS.length);
            setTime(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    const nextSlide = () => {
        setTime(0);
        setCurrentSlide((currentSlide + 1) % CREDITS.length);
    };

    return (
        // add on resize listener
        <Window
            top={48}
            left={48}
            width={450}
            height={800}
            windowTitle="Credits"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2024 ROOM'}
        >
            <div
                className="site-page credit"
                style={styles.credits}
            >
           
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    credits: {
        width: '100%',
        background: './assets/pictures/dont.png',
        paddingTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 64,
        color: 'white',
        overflow: 'hidden',
    },
    row: {
        overflow: 'none',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 600,
        alignSelf: 'center',
    },
    section: {
        overflow: 'none',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 32,
        opacity: 0,
    },
    sectionTitle: {
        marginBottom: 32,
    },
    slideContainer: {
        width: '100%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    nextSlideTimer: {
        width: 64,
        height: 32,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
};

export default Credits;
