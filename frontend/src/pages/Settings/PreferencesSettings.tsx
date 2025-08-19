import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";
import { SettingsContext } from "../../context/SettingsContext";
import Tile from "../../components/Tile/Tile";
import ErrorAlert from "../../components/Alerts/ErrorAlert";
import useApiErrorHandler from "../../hooks/useApiErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PreferencesContext } from "../../event/context/PreferencesContext";
import { PreferencesSettingsFormData, PreferencesSettingsFormDataSchema } from "../../schemas/formValidation/preferencesSettingsSchema";
import { ToggleSwitch } from "flowbite-react";
import { scrollToTop } from "../../components/utils/scroll";
import { triggerCustomFormSubmitEvent } from "../../event/eventCollectors/clickEvents";
import { useNavigate } from "react-router-dom";
import Button from "../../components/utils/Button";
import { FORMS, SUBMIT_BUTTONS } from '../../event/utils/constants';
import { toggleSwitchTheme } from '../../components/utils/themes/toggleSwitchTheme'


const PreferencesSettings = () => {
    const { t } = useTranslation();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { user } = useContext(UserContext);
    const { settings, updateSettings, getSettings } = useContext(SettingsContext);

    const { userPreferences, getAutoRedirectPreference } = useContext(PreferencesContext);

    const { register, formState: { isSubmitting }, setValue } = useForm<PreferencesSettingsFormData>({
        resolver: zodResolver(PreferencesSettingsFormDataSchema),
        defaultValues: {
            areEventsCollected: undefined,
            isNextStepVisible: undefined,
            isShortcutVisible: undefined,
            isQuickIconsVisible: undefined,
            isMenuPriorityVisible: undefined
        },
        mode: 'onSubmit'
    });

    const navigate = useNavigate();

    if (settings === null) {
        return (<div>Error</div>);
    }

    const [areEventsCollected, setAreEventsCollected] = useState(settings.preferencesSettings.areEventsCollected);
    const [isNextStepVisible, setIsNextStepVisible] = useState(settings.preferencesSettings.isNextStepVisible);
    const [isShortcutVisible, setIsShortcutVisible] = useState(settings.preferencesSettings.isShortcutVisible);
    const [isQuickIconsVisible, setIsQuickIconsVisible] = useState(settings.preferencesSettings.isQuickIconsVisible);
    const [isMenuPriorityVisible, setIsMenuPriorityVisible] = useState(settings.preferencesSettings.isMenuPriorityVisible);
    const [areTogglesDisabled, setAreTogglesDisabled] = useState(settings.preferencesSettings.areEventsCollected === false ? true : false);

    const providePreferencesSettingsRequestBody = () => {
        return {
            settings: {
                appSettings: {},
                preferencesSettings: {
                    areEventsCollected: areEventsCollected,
                    isNextStepVisible: isNextStepVisible,
                    isShortcutVisible: isShortcutVisible,
                    isQuickIconsVisible: isQuickIconsVisible,
                    isMenuPriorityVisible: isMenuPriorityVisible
                }
            }
        }
    }

    const handleAreEventsCollectedToggle = () => {
        
        if (areEventsCollected === true) {
            setIsNextStepVisible(false);
            setIsShortcutVisible(false);
            setIsQuickIconsVisible(false);
            setIsMenuPriorityVisible(false);
            setAreTogglesDisabled(true);
        } else {
            setAreTogglesDisabled(false);
        }
        
        setValue('areEventsCollected', true);
        setAreEventsCollected(!areEventsCollected); 
        alert(t('preferencesSettingsForm.alertInfo'));
    };

    const onSubmit = async () => {
        console.log("OKOKOk")
        clearApiError();
        const requestBody = providePreferencesSettingsRequestBody();
        console.log(requestBody);
        try {
            await updateSettings(user!, requestBody);
            await getSettings(user!);
            //getAutoRedirectPreference();
            // dodać ten formularz do listy formularzo-eventów
            triggerCustomFormSubmitEvent(FORMS.PREFERENCES_SETTINGS.id);
            
            // dodać obsługę tego formularza na backendzie
            console.log(userPreferences?.autoRedirectPreference?.preferencesSettingsForm)
            navigate(userPreferences?.autoRedirectPreference?.preferencesSettingsForm ?? '/dashboard');
        } catch (error) {
            handleError(error);
            scrollToTop();
        }
    };

    return (
        <Tile id="preferences-settings-form" title={t('preferencesSettingsForm.tile.title')}>
            <div id="form-error-alert">
                { apiError.isError &&
                    <ErrorAlert alertMessage={apiError.errorMessage} />
                }
            </div>
            <ToggleSwitch {...register('areEventsCollected')} label={t('preferencesSettingsForm.areEventsCollected')} checked={areEventsCollected} onChange={() => handleAreEventsCollectedToggle()} theme={toggleSwitchTheme} />
            <ToggleSwitch {...register('isNextStepVisible')} label={t('preferencesSettingsForm.isNextStepVisible')} checked={isNextStepVisible} onChange={() => {setValue('isNextStepVisible', true); setIsNextStepVisible(!isNextStepVisible)}} theme={toggleSwitchTheme} disabled={areTogglesDisabled} />
            <ToggleSwitch {...register('isShortcutVisible')} label={t('preferencesSettingsForm.isShortcutVisible')} checked={isShortcutVisible} onChange={() => {setValue('isShortcutVisible', true); setIsShortcutVisible(!isShortcutVisible)}} theme={toggleSwitchTheme} disabled={areTogglesDisabled} />
            <ToggleSwitch {...register('isQuickIconsVisible')} label={t('preferencesSettingsForm.isQuickIconsVisible')} checked={isQuickIconsVisible} onChange={() => {setValue('isQuickIconsVisible', true); setIsQuickIconsVisible(!isQuickIconsVisible)}} theme={toggleSwitchTheme} disabled={areTogglesDisabled} />
            <ToggleSwitch {...register('isMenuPriorityVisible')} label={t('preferencesSettingsForm.isMenuPriorityVisible')} checked={isMenuPriorityVisible} onChange={() => {setValue('isMenuPriorityVisible', true); setIsMenuPriorityVisible(!isMenuPriorityVisible)}} theme={toggleSwitchTheme} disabled={areTogglesDisabled} />
            <Button id={SUBMIT_BUTTONS.PREFERENCES_SETTINGS.id} isSubmitting={isSubmitting} onSubmit={onSubmit} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                {isSubmitting ? t('preferencesSettingsForm.loading') : t('preferencesSettingsForm.submit')}
            </Button>
        </Tile>
    );
}

export default PreferencesSettings;