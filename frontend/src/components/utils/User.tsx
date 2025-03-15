interface IUser {
    id: string;
    role: string;
    login: string;
    email: string;
    activeAccount: string | null;
    icon: File | null;
}

export interface IBackendUser {
    _id: string;
    role: string;
    login: string;
    email: string;
    active_account: string | null;
    created: string;
    is_deleted: boolean;
}

export const mapBackendUserToUser = (backendUser: IBackendUser): Partial<IUser> => {
    return {
        id: backendUser._id,
        login: backendUser.login,
        email: backendUser.email,
        activeAccount: backendUser.active_account,
        role: backendUser.role || 'USER'
    };
};

export class User implements IUser {
    id: string;
    role: string;
    login: string;
    email: string;
    activeAccount: string | null;
    icon: File | null;

    constructor(user: Partial<IUser> & { email: string }) {
        this.id = user.id ?? "";
        this.login = user.login ?? user.email;
        this.email = user.email;
        this.activeAccount = user.activeAccount ?? null;
        this.role = user.role ?? 'USER';
        this.icon = user.icon ?? null;
    }
}
