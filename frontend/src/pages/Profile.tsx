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
            await sendIcon(newIcon);
            await getIcon();
            // Profile icon doesnt refresh
            setNewIcon(null);
        }
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
                            onChange={(e) => setField(e.target.value)}
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
