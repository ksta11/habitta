export interface UserDTO{
    id?: string,
    name? : string,
    email?: string,
    password?: string,
    phone?: string,
    role?: string,
    creation_date?: Date,
}

export interface PasswordDTO{
    password: string,
}

export interface ChangePasswordDTO{
    password: string,
    newPassword: string,
}

export interface UserDAO {
    message?: string,
    user: {
        _id: string,
        name: string,
        email: string,
        password: string,
        phone: string,
        role: string,
        creation_date: Date,
    }
}

export interface UserResponseDAO {
    message?: string,
    user: {
        _id: string,
        name: string,
        email: string,
        phone: string,
        role: string,
        creation_date: Date,
    }
}

export interface BooleanDAO {
    message?: string,
    success: boolean,
}

export interface UsersDAO {
    message?: string,
    users: UserDAO[],
}

export interface VerifyDAO {
    message: string,
    verify: boolean,
}
