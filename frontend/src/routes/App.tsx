import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense, useContext, useEffect } from 'react';
import DefaultLoadingSkeleton from '../components/Loading/DefaultLoadingSkeleton';
import { setupUserDropdownClickEvents } from '../event/utils/clickEvents';
import { UserContext } from '../context/UserContext';

const App = () => {
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        const clickEvents = setupUserDropdownClickEvents(user);
        return clickEvents;
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
