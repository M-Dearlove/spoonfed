// models/Recipe.ts
import { Sequelize, Model, DataTypes } from 'sequelize';

export class SavedRecipe extends Model {
    public id!: number;
    public spoonacularId!: string;
    public title!: string;
    public imageUrl!: string;
    public ingredients!: string[];
    public instructions!: string[];
    public sourceUrl!: string;
    public matchingIngredients!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public userId!: number;
}

export const SavedRecipeGenerator = (sequelize: Sequelize) => {
    SavedRecipe.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            spoonacularId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ingredients: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            instructions: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            sourceUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            matchingIngredients: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'profiles',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'SavedRecipe',
            tableName: 'saved_recipes'
        }
    );

    return SavedRecipe;
};