import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense } from 'react';
import DefaultLoadingSkeleton from '../components/Loading/DefaultLoadingSkeleton';

const App = () => (
    <Suspense fallback={<DefaultLoadingSkeleton />}>
        <Layout>
            <Outlet />
        </Layout>
    </Suspense>
);

export default App;
