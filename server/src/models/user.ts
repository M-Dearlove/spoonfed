import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

// interface to define the components of a user.
interface UserAttributes {
    id: number;
    username: string;
    password: string;
    name: string | null;
    email: string | null;
    bio: string | null;
}

// sets id as optional
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'name' | 'email' | 'bio'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public name!: string | null;
    public email!: string | null;
    public bio!: string | null;
    public savedRecipes: any;

    // hashes the password prior to database storage for security.
    public async hashPassword(password: string) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(password, saltRounds);
    }
}

// function to create the profiles table
export function UserGenerator(sequelize: Sequelize): typeof User {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'profiles',
            sequelize,
            hooks: {
                beforeCreate: async (user: User) => {
                    await user.hashPassword(user.password);
                },
            }
        }
    );

    return User;
}