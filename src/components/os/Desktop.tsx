import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import Doom from '../applications/Doom';
import btcsrc from '../applications/BTCsrc';
import OregonTrail from '../applications/OregonTrail';
import ShutdownSequence from './ShutdownSequence';
// import ThisComputer from '../applications/ThisComputer';
import ROOM from '../applications/ROOM';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import Scrabble from '../applications/Scrabble';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

interface Application {
    key: string;
    name: string;
    shortcutIcon: IconName;
    component: string | React.FC<ExtendedWindowAppProps<any>>;
}

const Desktop: React.FC<DesktopProps> = (props) => {
    const [tokenName, setTokenName] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [tokenCA, setTokenCA] = useState('');
    const [pumpLink, setPumpLink] = useState('');

    useEffect(() => {
        fetch("https://apitoreturnca.onrender.com/api/purchaseData", {
          headers: {
            "x-access-key":
              "A1qQaAA9kdfnn4Mmn44bpoieIYHKkdghFKUD1978563llakLLLKdfslphgarcorc3haeogmmMNn243wf",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setTokenName(data.tokenName);
            setTelegramLink(data.telegramLink);
            setTwitterLink(data.twitterLink);
            setTokenCA(data.tokenCA);
            setPumpLink(data.link);
          })
          .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const APPLICATIONS = useMemo(() => {
        return {
            showcase: {
                key: 'showcase',
                name: 'Bitcoin Project',
                shortcutIcon: 'showcaseIcon',
                component: ShowcaseExplorer,
            },
            pumpfun: {
                key: 'pumpfun',
                name: 'pump.fun',
                shortcutIcon: 'pill',
                component: pumpLink,
            },
            telegram: {
                key: 'telegram',
                name: 'telegram',
                shortcutIcon: 'telegram',
                component: telegramLink,
            },
            x: {
                key: 'X',
                name: 'X',
                shortcutIcon: 'twitter',
                component: twitterLink,
            },
            // trail: {
            //     key: 'trail',
            //     name: 'The Oregon Trail',
            //     shortcutIcon: 'trailIcon',
            //     component: OregonTrail,
            // },
            doom: {
                key: 'doom',
                name: 'Doom',
                shortcutIcon: 'doomIcon',
                component: Doom,
            },
            btcsrc: {
                key: 'btcsrc',
                name: 'Bitcoin',
                shortcutIcon: 'btc',
                component: btcsrc,
            },
            scrabble: {
                key: 'scrabble',
                name: 'Scrabble',
                shortcutIcon: 'scrabbleIcon',
                component: Scrabble,
            },
            ROOM: {
                key: 'ROOM',
                name: 'ROOM',
                shortcutIcon: 'henordleIcon',
                component: ROOM,
            },
            credits: {
                key: 'credits',
                name: 'DONT CLICK HERE!',
                shortcutIcon: 'credits',
                component: Credits,
            },
        } as const; // 'as const' ajuda o TS a inferir chaves fixas
    }, [pumpLink, telegramLink, twitterLink, tokenCA, tokenName]);

    // Criamos um tipo baseado nas chaves de APPLICATIONS
    type ApplicationKeys = keyof typeof APPLICATIONS;

    const [windows, setWindows] = useState<DesktopWindows>({});
    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);
    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highestZIndex = 0;
        Object.keys(windows).forEach((key) => {
            const w = windows[key];
            if (w && w.zIndex > highestZIndex) {
                highestZIndex = w.zIndex;
            }
        });
        return highestZIndex;
    }, [windows]);

    const toggleMinimize = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            const highestIndex = getHighestZIndex();
            if (
                newWindows[key].minimized ||
                newWindows[key].zIndex === highestIndex
            ) {
                newWindows[key].minimized = !newWindows[key].minimized;
            }
            newWindows[key].zIndex = getHighestZIndex() + 1;
            return newWindows;
        });
    }, [getHighestZIndex]);

    const onWindowInteract = useCallback((key: string) => {
        setWindows((prevWindows) => ({
            ...prevWindows,
            [key]: {
                ...prevWindows[key],
                zIndex: 1 + getHighestZIndex(),
            },
        }));
    }, [getHighestZIndex]);

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns((prev) => prev + 1);
        }, 600);
    }, []);

    const addWindow = useCallback(
        (key: string, element: JSX.Element) => {
            const appKey = key as ApplicationKeys;
            setWindows((prevState) => ({
                ...prevState,
                [key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    component: element,
                    name: APPLICATIONS[appKey].name,
                    icon: APPLICATIONS[appKey].shortcutIcon,
                },
            }));
        },
        [getHighestZIndex, APPLICATIONS]
    );

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
    }, [shutdown, rebootDesktop]);

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((k) => {
            const key = k as ApplicationKeys;
            const app = APPLICATIONS[key];
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => {
                    if (typeof app.component === 'string' && app.component !== '') {
                        console.log("Abrindo link:", app.component);
                        window.open(app.component, '_blank');
                    } else if (typeof app.component === 'function') {
                        addWindow(
                            app.key,
                            <app.component
                                onInteract={() => onWindowInteract(app.key)}
                                onMinimize={() => minimizeWindow(app.key)}
                                onClose={() => removeWindow(app.key)}
                                key={app.key}
                            />
                        );
                    } else {
                        console.warn("Componente invÃ¡lido ou link vazio:", app.component);
                    }
                },
            });
        });

        // Se existe algum shortcut que deve abrir automaticamente, ajuste aqui
        // if (newShortcuts.some(s => s.shortcutName === 'My Showcase')) {
        //   ...
        // }

        setShortcuts(newShortcuts);
    }, [APPLICATIONS, addWindow, minimizeWindow, onWindowInteract, removeWindow]);

    return !shutdown ? (
        <div style={styles.desktop}>
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
                        style={{
                            zIndex: windows[key].zIndex,
                            ...(windows[key].minimized ? styles.minimized : {}),
                        }}
                    >
                        {React.cloneElement(element, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => (
                    <div
                        style={{ ...styles.shortcutContainer, top: i * 104 }}
                        key={shortcut.shortcutName}
                    >
                        <DesktopShortcut
                            icon={shortcut.icon}
                            shortcutName={shortcut.shortcutName}
                            onOpen={shortcut.onOpen}
                        />
                    </div>
                ))}
            </div>
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;
