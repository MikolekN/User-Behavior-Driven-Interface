import { useState, useContext, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/utils/Button';
import FormSelect from '../components/FormSelect/FormSelect';
import { useForm } from 'react-hook-form';

interface UserIconData {
    newIcon?: File;
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
    { value: 'login', label: 'Login' },
    { value: 'account_name', label: 'Nazwa konta' },
    { value: 'currency', label: 'Waluta' }
];

const UserProfile = () => {
    const [apiIconError, setApiIconError] = useState({ isError: false, errorMessage: "" });
    const [apiFieldError, setApiFieldError] = useState({ isError: false, errorMessage: "" });
    const [apiPasswordError, setApiPasswordError] = useState({ isError: false, errorMessage: "" });
    const { user, getUser, getIcon, sendIcon, updateUser, updatePassword } = useContext(AuthContext);

    const [, setFieldValue] = useState<string>('');

    const { handleSubmit: handleSubmitIcon, setValue: setIconValue } = useForm<UserIconData>();
    const { register: registerField, handleSubmit: handleSubmitField, setValue: setFieldValueForm, formState: { errors }, watch } = useForm<UserFieldData>();
    const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm<UserPasswordData>();
    
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
            setFieldValue(currentValue!);
            setFieldValueForm('value', currentValue!);
        }
    }, [user, getUserFieldValue, selectedField, setFieldValueForm]);

    if (!user) return <Navigate to="/login" />;


    const onIconSubmit = handleSubmitIcon(async ({ newIcon }) => {
        try {
            if (newIcon) {
                const processedIcon = await preprocessImage(newIcon);
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


    return (
        <div className="flex items-center justify-center">
            <Tile title="Profil użytkownika" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-6">
                    <form onSubmit={onIconSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block">Wybierz nową ikonę</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setIconValue("newIcon", file);
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button>Wybierz ikonę</Button>
                        </div>
                    </form>
                    {apiIconError.isError && <p className="text-red-600 mt-1 text-sm">{apiIconError.errorMessage}</p>}

                    <hr className="border-t border-gray-300 my-4" />

                    <form onSubmit={onFieldSubmit} className="space-y-4">
                        <FormSelect
                            label="Wybierz pole do zmiany"
                            options={validFields}
                            register={registerField('field', { required: 'Należy wybrać pole' })}
                            error={errors.field}
                            className="w-full"
                        />
                        <FormInput
                            label="New Value"
                            fieldType="text"
                            register={registerField('value', { required: true })}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Update Field</Button>
                        </div>
                    </form>
                    {apiFieldError.isError && <p className="text-red-600 mt-1 text-sm">{apiFieldError.errorMessage}</p>}

                    <hr className="border-t border-gray-300 my-4" />

                    <form onSubmit={onPasswordSubmit} className="space-y-4">
                        <FormInput
                            label="Current Password"
                            fieldType="password"
                            register={registerPassword('currentPassword', { required: true })}
                            className="w-full"
                        />
                        <FormInput
                            label="New Password"
                            fieldType="password"
                            register={registerPassword('newPassword', { required: true })}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Change Password</Button>
                        </div>
                    </form>
                    {apiPasswordError.isError && <p className="text-red-600 mt-1 text-sm">{apiPasswordError.errorMessage}</p>}
                </div>
            </Tile>
        </div>
    );
}

export default UserProfile;
