import React, { useState, KeyboardEvent } from 'react';
import ResumeDownload from './ResumeDownload';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    const [prompt, setPrompt] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const removeAsterisks = (text: string): string => text.replace(/\*+/g, '');

    const handleSend = async (): Promise<void> => {
        if (!prompt.trim()) return;
    
        const userMessage: Message = { role: 'user', content: prompt };
        setMessages((prev) => [...prev, userMessage]);
    
        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const formattedResponse = removeAsterisks(data.response);
                const assistantMessage: Message = { role: 'assistant', content: formattedResponse };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                const errorMessage: Message = { role: 'assistant', content: data.error || 'Erro ao obter resposta da IA.' };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Erro ao conectar ao servidor:', (error as Error).message);
            const errorMessage: Message = { role: 'assistant', content: 'Erro ao conectar ao servidor.' };
            setMessages((prev) => [...prev, errorMessage]);
        }
    
        setPrompt('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="site-page-content">
            <h1>Talk with GOALS </h1>
            <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                onKeyDown={handleKeyDown} 
            />
            <button onClick={handleSend}>Send</button>
            <div style={{ display: "block"}}>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        display: 'flex',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        backgroundColor: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;
