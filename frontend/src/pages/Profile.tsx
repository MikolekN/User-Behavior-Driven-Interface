import { useState, useContext, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/utils/Button';
import FormSelect from '../components/FormSelect/FormSelect';
import { useForm } from 'react-hook-form';
import { formValidationRules } from '../components/utils/validationRules';

interface UserIconData {
    files?: FileList;
}

interface UserFieldData {
    field: string;
    value: string;
}

interface UserPasswordData {
    currentPassword: string;
    newPassword: string;
}

const validFields = [
    { value: 'login', label: 'Nazwa użytkownika' },
    { value: 'account_name', label: 'Nazwa konta' },
    { value: 'currency', label: 'Waluta' }
];

const ProfilePage = () => {
    const [apiIconError, setApiIconError] = useState({ isError: false, errorMessage: "" });
    const [apiFieldError, setApiFieldError] = useState({ isError: false, errorMessage: "" });
    const [apiPasswordError, setApiPasswordError] = useState({ isError: false, errorMessage: "" });
    const { user, getUser, getIcon, sendIcon, updateUser, updatePassword } = useContext(AuthContext);

    const { register: registerIcon, handleSubmit: handleSubmitIcon } = useForm<UserIconData>();
    const { register: registerField, handleSubmit: handleSubmitField, setValue: setFieldValueForm, formState: { errors: fieldErrors }, watch } = useForm<UserFieldData>();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors } } = useForm<UserPasswordData>();
    
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
            setFieldValueForm('value', currentValue!);
        }
    }, [user, getUserFieldValue, selectedField, setFieldValueForm]);

    if (!user) return <Navigate to="/login" />;

    const onIconSubmit = handleSubmitIcon(async ({ files }) => {
        try {
            if (files && files[0]) {
                const processedIcon = await preprocessImage(files[0]);
                if (processedIcon) {
                    await sendIcon(processedIcon);
                    await getIcon();
                }
            }
        } catch (error) {
            setApiIconError({ isError: true, errorMessage: "Error updating user icon" });
        }
    });
    
    const preprocessImage = (file: File): Promise<File | null> => {
        return new Promise((resolve) => {
            const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validExtensions.includes(file.type)) {
                console.error("Invalid file type. Please upload a PNG or JPG image.");
                resolve(null);
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
                            console.error("Error processing image.");
                            resolve(null);
                        }
                    }, file.type);
                };
    
                img.onerror = () => {
                    console.error("Error loading image.");
                    resolve(null);
                };
            };
    
            reader.onerror = () => {
                console.error("Error reading file.");
                resolve(null);
            };
        });
    };

    const onFieldSubmit = handleSubmitField(async ({ field, value }) => {
        try {
            await updateUser(field, value);
            await getUser();
        } catch (error) {
            setApiFieldError({ isError: true, errorMessage: "Error updating user field" });
        }
    });

    const onPasswordSubmit = handleSubmitPassword(async ({ currentPassword, newPassword }) => {
        try {
            await updatePassword(currentPassword, newPassword);
        } catch (error) {
            setApiPasswordError({ isError: true, errorMessage: "Error updating password" });
        }
    });

    const getFieldLabel = (field: string) => {
        const fieldData = validFields.find((item) => item.value === field);
        return fieldData ? fieldData.label : '';
    };

    const valueValidation = (selectedField: string) => {
        switch (selectedField) {
            case 'login':
                return formValidationRules.userFields.login;
            case 'account_name':
                return formValidationRules.userFields.accountName;
            case 'currency':
                return formValidationRules.userFields.currency;
            default:
                return { required: 'Należy podać nową wartość' };
        }
    };
    return (
        <div className="flex items-center justify-center">
            <Tile title="Profil użytkownika" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-6">
                    <form onSubmit={onIconSubmit} className="space-y-4">
                        <FormInput
                            label="Wybierz nową ikonę"
                            fieldType="file"
                            register={registerIcon('files')}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Wybierz ikonę</Button>
                        </div>
                        <div>
                            {apiIconError.isError && <p className="text-red-600 mt-1 text-sm">{apiIconError.errorMessage}</p>}
                        </div>
                    </form>
    
                    <hr className="border-t border-gray-300 my-4" />
    
                    <form onSubmit={onFieldSubmit} className="space-y-4">
                        <FormSelect
                            label="Wybierz pole do zmiany"
                            options={validFields}
                            register={registerField('field', { required: 'Należy wybrać pole', validate: (value: string) => validFields.some((field) => field.value === value) || 'Należy wybrać poprawne pole' })}
                            error={fieldErrors.field}
                            className="w-full"
                        />
                        <FormInput
                            label={'Nowa ' + (selectedField ? getFieldLabel(selectedField).toLocaleLowerCase() : 'wartość')}
                            fieldType="text"
                            register={registerField('value', valueValidation(selectedField) )}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Zmień wartość</Button>
                        </div>
                        <div>
                            {apiFieldError.isError && <p className="text-red-600 mt-1 text-sm">{apiFieldError.errorMessage}</p>}
                        </div>
                    </form>
    
                    <hr className="border-t border-gray-300 my-4" />
    
                    <form onSubmit={onPasswordSubmit} className="space-y-4">
                        <FormInput
                            label="Hasło"
                            fieldType="password"
                            register={registerPassword('currentPassword', { required: formValidationRules.password.required, validate: formValidationRules.password.validate })}
                            error={passwordErrors.currentPassword}
                            className="w-full"
                        />
                        <FormInput
                            label="Nowe hasło"
                            fieldType="password"
                            register={registerPassword('newPassword', { required: formValidationRules.password.required, validate: formValidationRules.password.validate })}
                            
                            error={passwordErrors.currentPassword}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Zmień hasło</Button>
                        </div>
                        <div>
                            {apiPasswordError.isError && <p className="text-red-600 mt-1 text-sm">{apiPasswordError.errorMessage}</p>}
                        </div>
                    </form>
                </div>
            </Tile>
        </div>
    );
}

export default ProfilePage;
