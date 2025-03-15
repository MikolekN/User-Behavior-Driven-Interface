import { Checkbox, Dropdown } from "flowbite-react";
import i18n from "../../i18n";

const LanguageDropdownItem:React.FC<{image: string, name: string, code: string, isChosen: boolean}> = ({image, name, code, isChosen}) => {
    
    const handleChangeLanguage = (lang_code: string) => {
        i18n.changeLanguage(lang_code);
        localStorage.setItem('language', lang_code);
    };
    
    return (
        <Dropdown.Item onClick={() => {handleChangeLanguage(code)}} className="space-x-2 w-full">
            <img src={image} alt="" className="w-5 h-5" />
            <p>{name}</p>
            <Checkbox defaultChecked disabled className={`w-4 h-4 ${isChosen ? '' : 'hidden'}`}/>
        </Dropdown.Item>
    );
};

export default LanguageDropdownItem;
