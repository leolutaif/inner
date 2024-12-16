import React, { useEffect, useState } from 'react';
import { Link } from '../general';
import forHire from '../../assets/pictures/forHireGif.gif';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom'; // Updated import for BrowserRouter

export interface VerticalNavbarProps {}

const VerticalNavbar: React.FC<VerticalNavbarProps> = (props) => {
    const location = useLocation();
    const [projectsExpanded, setProjectsExpanded] = useState(false);
    const [isHome, setIsHome] = useState(false);

    const navigate = useNavigate();
    const goToContact = () => {
        navigate('/contact');
    };

    useEffect(() => {
        if (location.pathname.includes('/projects')) {
            setProjectsExpanded(true);
        } else {
            setProjectsExpanded(false);
        }
        if (location.pathname === '/') {
            setIsHome(true);
        } else {
            setIsHome(false);
        }
        return () => {};
    }, [location.pathname]);

    return !isHome ? (
        <div style={styles.navbar}>
            <div style={styles.header}>
                <h1 style={styles.headerText}>ROOM</h1>
                <h3 style={styles.headerShowcase}>Showcase '24</h3>
            </div>
            <div style={styles.links}>
                <Link containerStyle={styles.link} to="" text="Home" />
                <Link containerStyle={styles.link} to="about" text="About" />
                <Link containerStyle={styles.link} to="experience" text="ChatGLS" />
                {/* <Link containerStyle={Object.assign({}, styles.link, projectsExpanded && styles.expandedLink)} to="projects" text="PROJECTS" />
                {
                    projectsExpanded && (
                        <div style={styles.insetLinks}>
                            <Link containerStyle={styles.insetLink} to="projects/software" text="SOFTWARE" />
                            <Link containerStyle={styles.insetLink} to="projects/music" text="MUSIC" />
                            <Link containerStyle={styles.insetLink} to="projects/art" text="ART" />
                        </div>
                    )
                } */}
                {/* <Link containerStyle={styles.link} to="contact" text="CONTACT" /> */}
            </div>
        </div>
    
    ) : (
        <></>
    );
};

const styles: StyleSheetCSS = {
    navbar: {
        width: 300,
        height: '100%',
        flexDirection: 'column',
        padding: 48,
        boxSizing: 'border-box',
        position: 'fixed',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'column',
        marginBottom: 64,
    },
    headerText: {
        fontSize: 38,
        lineHeight: 1,
    },
    headerShowcase: {
        marginTop: 12,
    },
    logo: {
        width: '100%',
        marginBottom: 8,
    },
    link: {
        marginBottom: 32,
    },
    expandedLink: {
        marginBottom: 16,
    },
    insetLinks: {
        flexDirection: 'column',
        marginLeft: 32,
        marginBottom: 16,
    },
    insetLink: {
        marginBottom: 8,
    },
    links: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: '80%',
    },
    spacer: {
        flex: 1,
    },
    forHireContainer: {
        cursor: 'pointer',
        width: '100%',
    },
};

export default VerticalNavbar;
