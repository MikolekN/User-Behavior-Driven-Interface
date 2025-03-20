import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense, useContext, useEffect } from 'react';
import DefaultLoadingSkeleton from '../components/Loading/DefaultLoadingSkeleton';
import { setupSubmitButtonsClickEvents, setupUserDropdownClickEvents } from '../event/utils/clickEvents';
import { UserContext } from '../context/UserContext';

const App = () => {
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        const userDropdownClickEvents = setupUserDropdownClickEvents(user);
        const submitButtonsClickEvents = setupSubmitButtonsClickEvents(user);
        
        return () => {
            userDropdownClickEvents();
            submitButtonsClickEvents();
        };
    }, [user]);

    return (
        <Suspense fallback={<DefaultLoadingSkeleton />}>
            <Layout>
                <Outlet />
            </Layout>
        </Suspense>
    );
};

export default App;
