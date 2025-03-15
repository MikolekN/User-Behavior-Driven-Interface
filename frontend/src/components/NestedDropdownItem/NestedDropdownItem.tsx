import { Dropdown } from "flowbite-react";
import { LANGUAGES } from "../../pages/constants";
import i18n from "../../i18n";
import LanguageDropdownItem from "../LanguageDropdownItem/LanguageDropdownItem";
import { t } from "i18next";

const NestedDropdownItem: React.FC<{id: string}> = ({id}) => {
    return (
        <Dropdown arrowIcon={false} inline placement="right"
            renderTrigger={() => (
                <button
                    id={id}
                    type="button"
                    className="w-full cursor-pointer items-center justify-start px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white flex bg-transparent text-black font-normal hover:font-semibold hover:text-black"
                >
                    <img
                        src={LANGUAGES.find((language) => language.value === i18n.language)?.image}
                        alt=""
                        className="w-5 h-5 mr-1"
                    />
                    <p>{t('menu.language')}</p>
                </button>
            )}
        >
            {
                LANGUAGES.map((language) => (
                    <LanguageDropdownItem
                        key={language.value}
                        image={language.image}
                        name={t('menu.languages.' + language.key)}
                        code={language.value}
                        isChosen={i18n.language === language.value}
                    />
                ))
            }
        </Dropdown>
    );
};

export default NestedDropdownItem;
