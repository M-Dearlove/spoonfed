import dotenv from "dotenv";
dotenv.config();

import { Sequelize, Options } from "sequelize";
import { UserGenerator } from "./user.js";
import { SavedRecipeGenerator } from './Recipe.js';
import { UserPreferenceGenerator } from "./UserPreference.js";

// Base options that are always needed
const baseOptions: Options = {
  host: "localhost",
  dialect: "postgres",
  dialectOptions: {
    decimalNumbers: true,
  },
};

// Add SSL options only for production/remote database
const productionOptions: Options = {
  ...baseOptions,
  dialectOptions: {
    ...baseOptions.dialectOptions,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

// Choose options based on environment
const sequelize_options = process.env.DB_URL ? productionOptions : baseOptions;

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL as string, sequelize_options)
  : new Sequelize(
    process.env.DB_NAME || "",
    process.env.LOCAL_DB_USER || "",
    process.env.DB_PASSWORD,
    sequelize_options
  );

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = UserGenerator(sequelize);
const Recipe = SavedRecipeGenerator(sequelize);
const UserPreference = UserPreferenceGenerator(sequelize);

User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(UserPreference, { foreignKey: 'userId' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, User, Recipe, UserPreference };