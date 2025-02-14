import { useContext, useEffect, useCallback, useState } from 'react';
import Tile from '../../components/Tile/Tile';
import FormInput from '../../components/FormInput/FormInput';
import { UserContext } from '../../context/UserContext';
import { UserIconContext } from '../../context/UserIconContext';
import Button from '../../components/utils/Button';
import FormSelect from '../../components/FormSelect/FormSelect';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPasswordFormData, UserPasswordFormDataSchema } from '../../schemas/formValidation/userPasswordSchema';
import { UserFieldFormData, UserFieldFormDataSchema } from '../../schemas/formValidation/userFieldSchema';
import { UserIconFormDataSchema, UserIconFromData } from '../../schemas/formValidation/userIconSchema';
import { FIELD_SELECT_OPTIONS } from '../constants';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import { scrollToTop } from '../../components/utils/scroll';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [ selectedField, setSelectedField ] = useState<string>('');
    const { apiError: apiIconError, handleError: handleIconError, clearApiError: clearIconError } = useApiErrorHandler();
    const { apiError: apiFieldError, handleError: handleFieldError, clearApiError: clearFieldError } = useApiErrorHandler();
    const { apiError: apiPasswordError, handleError: handlePasswordError, clearApiError: clearPasswordError } = useApiErrorHandler();
    const { user, getUser, updateUser, updatePassword } = useContext(UserContext);
    const { getIcon, sendIcon } = useContext(UserIconContext);

    const { register: registerIcon, handleSubmit: handleSubmitIconForm, setValue: setIconValueForm, formState: { errors: iconErrors, isSubmitting: isIconFormSubmitting } } = useForm<UserIconFromData>({
        resolver: zodResolver(UserIconFormDataSchema)
    });
    const { register: registerField, handleSubmit: handleSubmitFieldForm, setValue: setFieldValueForm, formState: { errors: fieldErrors, isSubmitting: isFieldFormSubmitting }, clearErrors: clearFieldErrors } = useForm<UserFieldFormData>({
        resolver: zodResolver(UserFieldFormDataSchema)
    });
    const { register: registerPassword, handleSubmit: handleSubmitPasswordForm, formState: { errors: passwordErrors, isSubmitting: isPasswordFormSubmitting } } = useForm<UserPasswordFormData>({
        resolver: zodResolver(UserPasswordFormDataSchema)
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedField(e.target.value);
    }

    const mapFieldToBackend = (field: string): string => {
        return field === 'accountName' ? 'account_name' : field;
    }

    const getUserFieldValue = useCallback((field: string): string | undefined => {
        if (!user) return;
        switch (field) {
            case 'login':
                return user.login;
            case 'accountName':
                return user.accountName;
            case 'currency':
                return user.currency;
            default:
                return '';
        }
    }, [user]);

    useEffect(() => {
        if (selectedField && user) {
            const currentValue = getUserFieldValue(selectedField);
            clearFieldErrors();
            setFieldValueForm('value', currentValue!);
        }
        if (user && !selectedField) {
            setFieldValueForm('value', '');
        }
    }, [user, getUserFieldValue, selectedField, setFieldValueForm, clearFieldErrors]);

    const preprocessImage = (file: File): Promise<File | null> => {
        return new Promise((resolve, reject) => {
            const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validExtensions.includes(file.type)) {
                const error = `${t('profile.icon.imageFormatErrorMessage')}`;
                console.error(error);
                reject(error);
                return;
            }
    
            const reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
    
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
    
                    if (width > 120 || height > 120) {
                        const aspectRatio = width / height;
                        if (aspectRatio > 1) {
                            width = 120;
                            height = 120 / aspectRatio;
                        } else {
                            height = 120;
                            width = 120 * aspectRatio;
                        }
                    }
    
                    canvas.width = width;
                    canvas.height = height;
    
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
    
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const processedFile = new File([blob], file.name, { type: file.type });
                            resolve(processedFile);
                        } else {
                            const error = `${t('profile.icon.imageProcessingError')}`;
                            console.error(error);
                            reject(error);
                            return;
                        }
                    }, file.type);
                };
    
                img.onerror = () => {
                    const error = `${t('profile.icon.imageLoadingError')}`;
                    console.error(error);
                    reject(error);
                    return;
                };
            };
    
            reader.onerror = () => {
                const error = `${t('profile.icon.imageLoadingFile')}`;
                console.error(error);
                reject(error);
                return;
            };
        });
    };

    const onIconSubmit: SubmitHandler<UserIconFromData> = async ({ files }: UserIconFromData) => {
        clearIconError();
        try {
            if (files && files[0]) {
                const preprocessedIcon = await preprocessImage(files[0]);
                if (preprocessedIcon) {
                    await sendIcon(preprocessedIcon);
                    await getIcon();
                }
            }
            setIconValueForm('files', undefined);
        } catch (error) {
            scrollToTop('icon-form-wrapper');
            handleIconError(error);
        }
    };
    
    const onFieldSubmit: SubmitHandler<UserFieldFormData> = async ({ field, value }: UserFieldFormData) => {
        clearFieldError();
        try {
            const mappedField = mapFieldToBackend(field);
            await updateUser(mappedField, value);
            await getUser();
        } catch (error) {
            scrollToTop('field-form-wrapper');
            handleFieldError(error);
        }
    };

    const onPasswordSubmit: SubmitHandler<UserPasswordFormData> = async ({ currentPassword, newPassword }: UserPasswordFormData) => {
        clearPasswordError();
        try {
            await updatePassword(currentPassword, newPassword);
        } catch (error) {
            scrollToTop('password-form-wrapper');
            handlePasswordError(error);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Tile title={t('profile.tile.title')} className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-6">
                    <div id="icon-form-wrapper">
                        <form onSubmit={handleSubmitIconForm(onIconSubmit)} className="space-y-4">
                            { apiIconError.isError && 
                                <div className="my-4">
                                    <ErrorAlert alertMessage={apiIconError.errorMessage} />
                                </div> 
                            }
                            <FormInput
                                label={t('profile.icon.newIcon')}
                                fieldType="file"
                                register={registerIcon('files')}
                                error={iconErrors.files}
                                className="w-full"
                            />
                            <div className="flex justify-center">
                                <Button isSubmitting={isIconFormSubmitting} className="dark:bg-slate-900 dark:hover:bg-slate-800">
                                    {isIconFormSubmitting ? `${t('profile.icon.loading')}` : `${t('profile.icon.submit')}`}
                                </Button>
                            </div>
                        </form>
                    </div>
    
                    <hr className="border-t border-gray-300 my-4" />

                    <div id="field-form-wrapper">
                        <form onSubmit={handleSubmitFieldForm(onFieldSubmit)} className="space-y-4">
                            { apiFieldError.isError && 
                                <div className="my-4">
                                    <ErrorAlert alertMessage={apiFieldError.errorMessage} />
                                </div> 
                            }
                            <FormSelect
                                defaultOption={t('profile.field.defaultOption')}
                                onChange={handleChange}
                                label={t('profile.field.selectField')}
                                options={FIELD_SELECT_OPTIONS}
                                register={registerField('field')}
                                error={fieldErrors.field}
                                className="w-full"
                            />
                            <FormInput
                                label={`${t('profile.field.new')} ` + (selectedField ? `${t(`profile.field.${selectedField}`)}` : `${t('profile.field.value')}`)}
                                fieldType="text"
                                register={registerField('value')}
                                error={fieldErrors.value}
                                className="w-full"
                            />
                            <div className="flex justify-center">
                                <Button isSubmitting={isFieldFormSubmitting} className="dark:bg-slate-900 dark:hover:bg-slate-800">
                                    {isFieldFormSubmitting ? `${t('profile.field.loading')}` : `${t('profile.field.submit')}`}
                                </Button>
                            </div>
                        </form>
                    </div>
    
                    <hr className="border-t border-gray-300 my-4" />

                    <div id="password-form-wrapper">
                        <form onSubmit={handleSubmitPasswordForm(onPasswordSubmit)} className="space-y-4">
                            { apiPasswordError.isError && 
                                <div className="my-4">
                                    <ErrorAlert alertMessage={apiPasswordError.errorMessage} />
                                </div> 
                            }
                            <FormInput
                                label={t('profile.password.password')}
                                fieldType="password"
                                register={registerPassword('currentPassword')}
                                error={passwordErrors.currentPassword}
                                className="w-full"
                            />
                            <FormInput
                                label={t('profile.password.newPassword')}
                                fieldType="password"
                                register={registerPassword('newPassword')}
                                error={passwordErrors.newPassword}
                                className="w-full"
                            />
                            <div className="flex justify-center">
                                <Button isSubmitting={isPasswordFormSubmitting} className="dark:bg-slate-900 dark:hover:bg-slate-800">
                                    {isPasswordFormSubmitting ? `${t('profile.password.loading')}` : `${t('profile.password.submit')}`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default ProfilePage;
