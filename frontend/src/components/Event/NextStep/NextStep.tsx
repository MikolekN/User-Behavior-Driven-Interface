import { t } from "i18next";
import Tile from "../../Tile/Tile";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import useApiErrorHandler from "../../../hooks/useApiErrorHandler";
import { PreferencesContext } from "../../../event/context/PreferencesContext";
import Button from "../../utils/Button";
import { Link } from "react-router-dom";

const NextStep = () => {
    const { handleError } = useApiErrorHandler();
    const { user } = useContext(UserContext);
    const { nextStepPreference, getNextStepPreference } = useContext(PreferencesContext);

    useEffect(() => {
        if (!user) return;

        const fetchNextStep = async () => {
            try {
                await getNextStepPreference(user);
            } catch (error) {
                handleError(error);
            }
        };

        fetchNextStep();

        const intervalId = setInterval(fetchNextStep, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="hidden md:flex">
                <Tile id="next-step" title={t('nextStep.tile.title')}>
                    <div className="flex">
                        <Link to={`${nextStepPreference?.nextPage ? nextStepPreference.nextPage : "/dashboard"}`} className="m-2 hover:text-blue-700 hover:font-semibold dark:hover:text-blue-400 w-full">
                            <Button className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                                    {nextStepPreference?.nextPage ? t(`urls.${nextStepPreference.nextPage}`): t(`urls./dashboard`)}
                            </Button>
                        </Link>
                    </div>
                </Tile>
            </div>
            <div className="flex justify-center items-center md:hidden w-full">
                <Tile id="next-step" title={t('nextStep.tile.title')}>
                    <div className="w-full flex justify-center flex-wrap">
                        <Link to={`${nextStepPreference?.nextPage ? nextStepPreference.nextPage : "/dashboard"}`} className="m-2 hover:text-blue-700 hover:font-semibold dark:hover:text-blue-400 w-full">
                            <Button className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                                    {nextStepPreference?.nextPage ? t(`urls.${nextStepPreference.nextPage}`): t(`urls./dashboard`)}
                            </Button>
                        </Link>
                    </div>
                </Tile>
            </div>
        </>
    );
};

export default NextStep;
