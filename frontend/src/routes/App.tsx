import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense, useContext, useEffect } from 'react';
import { Suspense, useContext, useEffect, useState } from 'react';
import DefaultLoadingSkeleton from '../components/Loading/DefaultLoadingSkeleton';
import { setupSubmitButtonsClickEvents, setupUserDropdownClickEvents } from '../event/utils/clickEvents';
import { UserContext } from '../context/UserContext';
import { t } from 'i18next';

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

	if (isTabOpen) {
		return (
			<></>
		);
	};

    return (
        <Suspense fallback={<DefaultLoadingSkeleton />}>
            <Layout>
                <Outlet />
            </Layout>
        </Suspense>
    );
};

export default App;
