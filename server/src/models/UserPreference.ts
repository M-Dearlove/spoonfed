// models/UserPreference.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserPreferenceAttributes {
  id?: number;
  userId: number;
  dietaryRestrictions: string[];
  favoritesCuisines: string[];
  cookingSkillLevel: string;
}

export class UserPreference extends Model<UserPreferenceAttributes> {
  public id!: number;
  public userId!: number;
  public dietaryRestrictions!: string[];
  public favoritesCuisines!: string[];
  public cookingSkillLevel!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const UserPreferenceGenerator = (sequelize: Sequelize) => {
  UserPreference.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id'
        }
      },
      dietaryRestrictions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
      },
      favoritesCuisines: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
      },
      cookingSkillLevel: {
        type: DataTypes.STRING,
        defaultValue: 'intermediate',
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'UserPreference',
      tableName: 'user_preferences',
      timestamps: true
    }
  );

  return UserPreference;
};