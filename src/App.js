import React,{useEffect} from 'react';
import './App.css';

import { SettingsProvider } from './context/SettingsProvider.jsx';
import { LessonStateProvider } from './context/LessonStateProvider.jsx';
import { ActiveLessonProvider } from './context/ActiveLessonProvider.jsx';
import Main from './Main.js';
import { BrowserRouter } from 'react-router-dom';
import { ExerciseSettingsProvider } from './context/ExerciseSettingsProvider.jsx';

function App() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <SettingsProvider>
                    <LessonStateProvider>
                        <ActiveLessonProvider>
                            <ExerciseSettingsProvider>
                                <Main/>
                            </ExerciseSettingsProvider>
                        </ActiveLessonProvider>
                    </LessonStateProvider>
                </SettingsProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
