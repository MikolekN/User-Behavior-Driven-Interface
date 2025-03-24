import { Link } from "react-router-dom";
import Button from "../../utils/Button";
import { t } from "i18next";
import Tile from "../../Tile/Tile";
import { useEffect, useState } from "react";

const Shortcut = () => {
    const [links, setLinks] = useState<string[]>([]);

    useEffect(() => {
        const setMockShortcutLinks = () => {
            setLinks(["cyclic-payments", "transfer", "loan", "dashboard"]);
        }
        
        setMockShortcutLinks();
    }, []);

    return (
        <>
            <div className="hidden md:flex">
                <Tile title="Shortcut">
                    {links.map((link, index) => (
                        <Link key={index} to={`/${link}`} className="m-2">
                            
                                {/* {t('pageNotFound.backToDashboard')} */}
                                {link}
                            
                        </Link> 
                    ))}
                </Tile>
            </div>
            <div className="md:hidden">
                <Tile title="Shortcut">
                    <div className="flex flex-row">
                        {links.map((link, index) => (
                            <Link key={index} to={`/${link}`} className="m-2">
                                
                                    {/* {t('pageNotFound.backToDashboard')} */}
                                    {link}
                                
                            </Link> 
                        ))}
                    </div>
                </Tile>
            </div>
        </>
    );
};

export default Shortcut;