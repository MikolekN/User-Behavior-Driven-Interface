import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Suspense } from 'react';

const App = () => (
    <Suspense fallback="loading">
        <Layout>
            <Outlet />
        </Layout>
    </Suspense>
);

export default App;
