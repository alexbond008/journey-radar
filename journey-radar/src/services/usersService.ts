import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  current_train_id?: number | null;
  level: number;
}

export const usersService = {
  /**
   * Get all users from the backend
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/info/users');
    return response.data;
  },

  /**
   * Verify if a user exists by name (case-insensitive)
   */
  verifyUserByName: async (name: string): Promise<User | null> => {
    const users = await usersService.getAllUsers();
    const user = users.find(
      (u) => u.name.toLowerCase() === name.trim().toLowerCase()
    );
    return user || null;
  },
};

