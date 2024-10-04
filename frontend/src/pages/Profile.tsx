import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/utils/Button';
import FormSelect from '../components/FormSelect/FormSelect';

interface UserProfileData {
    newIcon?: File;
    field: string;
    value: string;
    currentPassword: string;
    newPassword: string;
}

const validFields = [
    { value: 'login', label: 'Login' },
    { value: 'account_name', label: 'Nazwa konta' },
    { value: 'currency', label: 'Waluta' }
];

const UserProfile = () => {
    const [apiError, setApiError] = useState({ isError: false, errorMessage: "" });
    const { user, getUser, getIcon, sendIcon, updateUser, updatePassword } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileData>();

    if (!user) return <Navigate to="/login" />;

    const onIconSubmit = handleSubmit(async ({ newIcon }) => {
        if (newIcon) {
            await sendIcon(newIcon);
            await getIcon();
        }
    });

    const onUpdateUserFieldSubmit = handleSubmit(async ({ field, value }) => {
        try {
            await updateUser(field, value);
            await getUser();
        } catch (error) {
            setApiError({ isError: true, errorMessage: "Error updating user field" });
        }
    });
    
    const onUpdatePasswordSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
        try {
            await updatePassword(currentPassword, newPassword);
        } catch (error) {
            setApiError({ isError: true, errorMessage: "Error updating password" });
        }
    });

    return (
        <div className="flex items-center justify-center">
            <Tile title="Profil użytkownika" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-6">
                    <form onSubmit={onIconSubmit} className="space-y-4">
                        <FormInput
                            label="Wybierz nową ikonę"
                            fieldType="file"
                            register={register('newIcon')}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Wybierz ikonę</Button>
                        </div>
                    </form>

                    <hr className="border-t border-gray-300 my-4" />

                    <form onSubmit={onUpdateUserFieldSubmit} className="space-y-4">
                        <FormSelect
                            label="Wybierz pole do zmiany"
                            options={validFields}
                            register={register('field', { required: 'Należy wybrać pole' })}
                            error={errors.field}
                            className="w-full"
                        />
                        <FormInput
                            label="New Value"
                            fieldType="text"
                            register={register('value', { required: true })}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Update Field</Button>
                        </div>
                    </form>

                    <hr className="border-t border-gray-300 my-4" />

                    <form onSubmit={onUpdatePasswordSubmit} className="space-y-4">
                        <FormInput
                            label="Current Password"
                            fieldType="password"
                            register={register('currentPassword', { required: true })}
                            className="w-full"
                        />
                        <FormInput
                            label="New Password"
                            fieldType="password"
                            register={register('newPassword', { required: true })}
                            className="w-full"
                        />
                        <div className="flex justify-center">
                            <Button>Change Password</Button>
                        </div>
                    </form>

                    {apiError.isError && <p className="text-red-600 mt-1 text-sm">{apiError.errorMessage}</p>}
                </div>
            </Tile>
        </div>
    );
}

export default UserProfile;
