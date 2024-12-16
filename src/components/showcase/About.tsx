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
            <h3>We are GOALS</h3>
            <br />
            <div className="text-block">
                <p>
                GOALS AI is a platform that uses artificial intelligence to assist individuals and organizations in setting and tracking effective goals.

The platform employs the concept of SMART goals — Specific, Measurable, Achievable, Relevant, and Time-bound — to ensure that the objectives established are clear and attainable.

By integrating advanced AI algorithms, GOALS AI offers personalized action plans, breaking down broad goals into smaller, manageable tasks tailored to the user's level of expertise and the required support.

Additionally, the platform provides features such as progress tracking and strategy suggestions based on proven success principles, facilitating continuous monitoring and goal adjustments as performance evolves.

By automating and optimizing the goal-setting process, GOALS AI aims to increase productivity and efficiency, allowing users to focus their efforts on strategic and creative activities.
                </p>
                <br />
               
            </div>
            <div className="text-block">
                <h3>About GOALS</h3>
                <br />
                <p>
                GOALS AI is an intelligent platform designed to help individuals and organizations set, track, and achieve their goals more effectively. Utilizing the SMART framework — Specific, Measurable, Achievable, Relevant, and Time-bound — GOALS AI leverages advanced AI algorithms to break down complex objectives into actionable steps, provide real-time progress tracking, and offer personalized strategy recommendations. By simplifying the goal-setting process and offering adaptive support, GOALS AI empowers users to stay focused, productive, and aligned with their most important
                </p>
                <br />
              
                <br />
                <p>
                    Industry experience at Hover offered a chance to bridge academic theory with real-world application. Focused on user-centric development, I sharpened my proficiency in front-end technologies and learned to balance function with form. Every role undertaken serves as a node in the expanding network of knowledge.
                </p>
                <br />
                <br />

                <br />
               
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
