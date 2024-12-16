import Button from '../../components/utils/Button';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <section>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center self-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl dark:text-white">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
                    <Link to={'/'}>
                        <Button>
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>   
            </div>
        </section>
    ) 
};

export default PageNotFound;
