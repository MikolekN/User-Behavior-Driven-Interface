import { useContext, useEffect, useCallback } from 'react';
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
import { validFields } from './ProfileData';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';

const ProfilePage = () => {
    const { apiError: iconApiError, handleError: handleIconError } = useApiErrorHandler();
    const { apiError: fieldApiError, handleError: handleFieldError } = useApiErrorHandler();
    const { apiError: passwordApiError, handleError: handlePasswordError } = useApiErrorHandler();
    const { user, getUser, updateUser, updatePassword } = useContext(UserContext);
    const { getIcon, sendIcon } = useContext(UserIconContext);

    const { register: registerIcon, handleSubmit: handleSubmitIcon, setValue: setIconValueForm, formState: { errors: iconErrors } } = useForm<UserIconFromData>({
        resolver: zodResolver(UserIconFormDataSchema)
    });
    const { register: registerField, handleSubmit: handleSubmitField, setValue: setFieldValueForm, formState: { errors: fieldErrors }, watch, clearErrors: clearFieldErrors } = useForm<UserFieldFormData>({
        resolver: zodResolver(UserFieldFormDataSchema)
    });
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors } } = useForm<UserPasswordFormData>({
        resolver: zodResolver(UserPasswordFormDataSchema)
    });
    
    const selectedField = watch('field');

    const getUserFieldValue = useCallback((field: string): string | undefined => {
        if (!user) return;
        switch (field) {
            case 'login':
                return user.login;
            case 'account_name':
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
                const error = 'Invalid file type. Please upload a PNG or JPG image.';
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
                            const error = 'Error processing image.';
                            console.error(error);
                            reject(error);
                            return;
                        }
                    }, file.type);
                };
    
                img.onerror = () => {
                    const error = 'Error loading image.';
                    console.error(error);
                    reject(error);
                    return;
                };
            };
    
            reader.onerror = () => {
                const error = 'Error reading file.';
                console.error(error);
                reject(error);
                return;
            };
        });
    };

    const onIconSubmit: SubmitHandler<UserIconFromData> = (async ({ files }: UserIconFromData) => {
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
            handleIconError(error);
        }
    });
    
    const onFieldSubmit: SubmitHandler<UserFieldFormData> = (async ({ field, value }: UserFieldFormData) => {
        try {
            await updateUser(field, value);
            await getUser();
        } catch (error) {
            handleFieldError(error);
        }
    });

    const onPasswordSubmit: SubmitHandler<UserPasswordFormData> = (async ({ currentPassword, newPassword }: UserPasswordFormData) => {
        try {
            await updatePassword(currentPassword, newPassword);
        } catch (error) {
            handlePasswordError(error);
        }
    });

    const getFieldLabel = (field: string) => {
        const fieldData = validFields.find((item) => item.value === field);
        return fieldData ? fieldData.label : '';
    };

    return (
        <div className="flex items-center justify-center">
            <Tile title="Profil użytkownika" className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-6">
                    <form onSubmit={handleSubmitIcon(onIconSubmit)} className="space-y-4">
                        <FormInput
                            label="Wybierz nową ikonę"
                            fieldType="file"
                            register={registerIcon('files')}
                            error={iconErrors.files}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Wybierz ikonę</Button>
                        </div>
                        <div>
                            {iconApiError.isError && <p className="text-red-600 mt-1 text-sm">{iconApiError.errorMessage}</p>}
                        </div>
                    </form>
    
                    <hr className="border-t border-gray-300 my-4" />
    
                    <form onSubmit={handleSubmitField(onFieldSubmit)} className="space-y-4">
                        <FormSelect
                            label="Wybierz pole do zmiany"
                            options={validFields}
                            register={registerField('field')}
                            error={fieldErrors.field}
                            className="w-full"
                        />
                        <FormInput
                            label={'Nowa ' + (selectedField ? getFieldLabel(selectedField).toLocaleLowerCase() : 'wartość')}
                            fieldType="text"
                            register={registerField('value')}
                            error={fieldErrors.value}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Zmień wartość</Button>
                        </div>
                        <div>
                            {fieldApiError.isError && <p className="text-red-600 mt-1 text-sm">{fieldApiError.errorMessage}</p>}
                        </div>
                    </form>
    
                    <hr className="border-t border-gray-300 my-4" />
    
                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                        <FormInput
                            label="Hasło"
                            fieldType="password"
                            register={registerPassword('currentPassword')}
                            error={passwordErrors.currentPassword}
                            className="w-full"
                        />
                        <FormInput
                            label="Nowe hasło"
                            fieldType="password"
                            register={registerPassword('newPassword')}
                            error={passwordErrors.newPassword}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Zmień hasło</Button>
                        </div>
                        <div>
                            {passwordApiError.isError && <p className="text-red-600 mt-1 text-sm">{passwordApiError.errorMessage}</p>}
                        </div>
                    </form>
                </div>
            </Tile>
        </div>
    );
};

export default ProfilePage;
