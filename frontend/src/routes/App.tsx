import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense, useContext, useEffect, useState } from 'react';
import DefaultLoadingSkeleton from '../components/Loading/DefaultLoadingSkeleton';
import { setupFormSucessfulSubmitButtonsClickEvents, setupUserDropdownClickEvents } from '../event/eventCollectors/clickEvents';
import { UserContext } from '../context/UserContext';
import { startTracking } from '../event/eventCollectors/pageTransition';
import { t } from 'i18next';
import Shortcut from '../components/Event/Shortcut/Shortcut';
import { setupMainMenuHoverEvents } from '../event/eventCollectors/hoverEvents';
import { AuthContext } from '../context/AuthContext';

const App = () => {
    const { user } = useContext(UserContext);
    const { logout } = useContext(AuthContext);
    const [isTabOpen, setIsTabOpen] = useState<boolean>(false);

    useEffect(() => {
        const uniqueTabId = Date.now().toString();
        localStorage.setItem("tabId", uniqueTabId);
    
        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === "tabId") {
				alert(t('blockedTabInfo'));
				setIsTabOpen(true);
                logout();
          }
        };
    
        window.addEventListener("storage", handleStorageChange);
    
        return () => {
			window.removeEventListener("storage", handleStorageChange);
			localStorage.removeItem("tabId"); // Clean up when tab is closed
			setIsTabOpen(false);
        };
    }, []);

    useEffect(() => {
        window.addEventListener('unload', logout);
        return () => {
            window.removeEventListener('unload', logout);
        };
    });

    useEffect(() => {
        const userDropdownClickEvents = setupUserDropdownClickEvents(user);
        const submitButtonsClickEvents = setupFormSucessfulSubmitButtonsClickEvents(user);
        const mainMenuHoverEvents = setupMainMenuHoverEvents(user);
        
        return () => {
            userDropdownClickEvents();
            submitButtonsClickEvents();
            mainMenuHoverEvents();
        };
    }, [user]);

    useEffect(() => {
        const startTrackingRef = startTracking(user);

        return () => {
            startTrackingRef();
        };
    }, [user]);

	if (isTabOpen) {
		return (
			<></>
		);
	};

    if (!user) {
        return (
            <Suspense fallback={<DefaultLoadingSkeleton />}>
                <Layout>
                    <Outlet />
                </Layout>
            </Suspense>
        );
    };

    return (
        <Suspense fallback={<DefaultLoadingSkeleton />}>
            <Layout>
                <div className="hidden md:flex w-full h-screen">
                    <div className="flex items-center justify-center w-1/4 md:h-auto">
                        <Shortcut />
                    </div>
                    <div className="flex items-center justify-center w-2/4">
                        <Outlet />
                    </div>
                </div>
                <div className="md:hidden flex flex-col justify-center items-center">
                    <Shortcut />
                    <Outlet />
                </div>
            </Layout>
        </Suspense>
    );
};

export default App;
