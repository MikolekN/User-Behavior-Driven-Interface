import { Link } from "react-router-dom";
import { t } from "i18next";
import Tile from "../../Tile/Tile";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import useApiErrorHandler from "../../../hooks/useApiErrorHandler";
import { PreferencesContext } from "../../../event/context/PreferencesContext";
import externalLink  from "../../../assets/images/external-link.svg";

const Shortcut = () => {
    const { handleError } = useApiErrorHandler();
    const { user } = useContext(UserContext);
    const { userPreferences, shortcutPreference, getShortcutPreference, getUserPreference } = useContext(PreferencesContext);

    useEffect(() => {
        if (!user) return;
        const fetchShortcutPreferences = async () => {
            try {
                await getUserPreference(user);
            } catch (error) {
                handleError(error);
            }
        };

        void fetchShortcutPreferences();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const getShortcutPreferenceData = () => {
            if (userPreferences) {
                getShortcutPreference();
            }
        };

        getShortcutPreferenceData();
    }, [userPreferences]);

    if (shortcutPreference === null || shortcutPreference?.links.length === 0) {
        return (
            <></>
        );
    };

    return (
        <>
            <div className="hidden md:flex">
                <Tile title={t('shortcut.tile.title')}>
                    {shortcutPreference?.links.map((link, index) => (
                        <div className="flex">
                            <Link key={index} to={`${link}`} className="m-2 hover:text-blue-700 hover:font-semibold dark:hover:text-blue-400">
                                {t(`shortcut.${link}`)}
                            </Link>
                            <img src={externalLink} alt="externalLink" width={16} height={16} />
                        </div>
                    ))}
                </Tile>
            </div>
            <div className="md:hidden">
                <Tile title={t('shortcut.tile.title')}>
                    <div className="w-full flex justify-center flex-wrap">
                        {shortcutPreference?.links.map((link, index) => (
                           <div className="flex">
                                <Link key={index} to={`${link}`} className="m-2 hover:text-blue-700 hover:font-semibold dark:hover:text-blue-400">
                                    {t(`shortcut.${link}`)}
                                </Link>
                                <img src={externalLink} alt="externalLink" width={16} height={16} />
                            </div>
                        ))}
                    </div>
                </Tile>
            </div>
        </>
    );
};

export default Shortcut;