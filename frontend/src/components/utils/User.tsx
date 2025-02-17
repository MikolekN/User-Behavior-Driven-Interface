interface IUser {
    role: string;
    login: string;
    email: string;
    activeAccount: string | null;
    icon: File | null;
}

export interface IBackendUser {
    role: string;
    login: string;
    email: string;
    active_account: string | null;
    created: string;
    is_deleted: boolean;
}

export const mapBackendUserToUser = (backendUser: IBackendUser): Partial<IUser> => {
    return {
        login: backendUser.login,
        email: backendUser.email,
        activeAccount: backendUser.active_account,
        role: backendUser.role || 'USER'
    };
};

export class User implements IUser {
    role: string;
    login: string;
    email: string;
    activeAccount: string | null;
    icon: File | null;

    constructor(user: Partial<IUser> & { email: string }) {
        this.login = user.login ?? user.email;
        this.email = user.email;
        this.activeAccount = user.activeAccount ?? '';
        this.role = user.role ?? 'USER';
        this.icon = user.icon ?? null;
    }
}
