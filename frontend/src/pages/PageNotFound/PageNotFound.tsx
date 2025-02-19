import { useTranslation } from 'react-i18next';
import Button from '../../components/utils/Button';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    const { t } = useTranslation();

    return (
        <section>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center self-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl dark:text-white">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{t('pageNotFound.title')}</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">{t('pageNotFound.message')}</p>
                    <Link to={'/'}>
                        <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">
                            {t('pageNotFound.backToDashboard')}
                        </Button>
                    </Link>
                </div>   
            </div>
        </section>
    ) 
};

export default PageNotFound;
