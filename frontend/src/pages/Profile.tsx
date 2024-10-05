import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/utils/Button';
import FormSelect from '../components/FormSelect/FormSelect';

const validFields = [
    { value: 'login', label: 'Login' },
    { value: 'account_name', label: 'Nazwa konta' },
    { value: 'currency', label: 'Waluta' }
];

const UserProfile = () => {
    const [apiError, setApiError] = useState({ isError: false, errorMessage: "" });
    const { user, getUser, getIcon, sendIcon, updateUser, updatePassword } = useContext(AuthContext);
    
    const [newIcon, setNewIcon] = useState<File | null>(null);
    const [field, setField] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    if (!user) return <Navigate to="/login" />;

    const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setNewIcon(event.target.files[0]);
        }
    };

    const handleIconSubmit = async () => {
        if (newIcon) {
            const processedIcon = await preprocessImage(newIcon);
            if (processedIcon) {
                await sendIcon(processedIcon);
                await getIcon();
                // Profile icon doesnt refresh
                setNewIcon(null);
            }
        }
    };
    
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

    const handleUserFieldUpdate = async () => {
        try {
            await updateUser(field, value);
            await getUser();
            setField('');
            setValue('');
        } catch (error) {
            setApiError({ isError: true, errorMessage: "Error updating user field" });
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await updatePassword(currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setApiError({ isError: true, errorMessage: "Error updating password" });
        }
    };

    const getUserFieldValue = (field: string): string => {
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
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedField = e.target.value;
        setField(selectedField);
        setValue(getUserFieldValue(selectedField));
    };

    return (
        <div className="flex items-center justify-center">
            <Tile title="Profil użytkownika" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-6">
                    <div className="space-y-4">
                        <FormInput
                            label="Wybierz nową ikonę"
                            fieldType="file"
                            onChange={handleIconChange}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button onClick={handleIconSubmit}>Wybierz ikonę</Button>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    <div className="space-y-4">
                        <FormSelect
                            label="Wybierz pole do zmiany"
                            options={validFields}
                            onChange={handleFieldChange}
                            value={field}
                            className="w-full"
                        />
                        <FormInput
                            label="New Value"
                            fieldType="text"
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button onClick={handleUserFieldUpdate}>Update Field</Button>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 my-4" />

                    <div className="space-y-4">
                        <FormInput
                            label="Current Password"
                            fieldType="password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            value={currentPassword}
                            className="w-full"
                        />
                        <FormInput
                            label="New Password"
                            fieldType="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button onClick={handlePasswordUpdate}>Change Password</Button>
                        </div>
                    </div>

                    {apiError.isError && <p className="text-red-600 mt-1 text-sm">{apiError.errorMessage}</p>}
                </div>
            </Tile>
        </div>
    );
}

export default UserProfile;
