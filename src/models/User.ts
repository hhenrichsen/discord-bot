import { Document, Schema, model } from 'mongoose';

export interface User {
    snowflake: string;
    admin?: boolean;
}

const UserSchema = new Schema({
    snowflake: String,
    admin: {
        type: Boolean,
        required: false,
        default: false,
    },
}, {
    timestamps: true,
});

export interface IUserModel extends User, Document {}
export const UserModel = model<IUserModel>('User', UserSchema);
export default UserModel;