import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense, useContext, useEffect, useState } from 'react';
import DefaultLoadingSkeleton from '../components/Loading/DefaultLoadingSkeleton';
import { setupSubmitButtonsClickEvents, setupUserDropdownClickEvents } from '../event/utils/clickEvents';
import { UserContext } from '../context/UserContext';
import { startTracking } from '../event/utils/pageTransition';
import { t } from 'i18next';
import Shortcut from '../components/Event/Shortcut/Shortcut';

const App = () => {
    const { user } = useContext(UserContext);
    const [isTabOpen, setIsTabOpen] = useState<boolean>(false);
    
    useEffect(() => {
        const userDropdownClickEvents = setupUserDropdownClickEvents(user);
        const submitButtonsClickEvents = setupSubmitButtonsClickEvents(user);
        
        return () => {
            userDropdownClickEvents();
            submitButtonsClickEvents();
        };
    }, [user]);

    useEffect(() => {
        const uniqueTabId = Date.now().toString();
        localStorage.setItem("tabId", uniqueTabId);
    
        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === "tabId") {
				alert(t('blockedTabInfo'));
				setIsTabOpen(true);
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
                    <div className="flex items-start justify-center w-1/4 h-fit mt-32">
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
