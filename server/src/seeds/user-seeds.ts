import { User } from '../models/user.js';

export const seedUsers = async () => {
  await User.bulkCreate([
    { username: 'TammyP', password: 'ilikecheese2', name: 'Tammy Peterson', email: 'tammy@example.com', bio: 'I love cooking Italian food!' },
    { username: 'NovaBean', password: 'iamdog0322', name: 'Nova Bean', email: 'nova@example.com', bio: 'Aspiring chef with a passion for pastries.' },
    { username: 'HelloKitty', password: 'kuromi1104', name: 'Katherine Hello', email: 'kitty@example.com', bio: 'Learning to cook one recipe at a time.' },
  ], { individualHooks: true });
};