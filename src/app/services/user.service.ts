import { Injectable } from '@angular/core';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localStorageKey = 'users';

  constructor() {}

  // Fetch users from local storage
  getUsers(): User[] {
    const users = localStorage.getItem(this.localStorageKey);
    return users ? JSON.parse(users) : [];
  }

  // Save users to local storage
  saveUsers(users: User[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  // Add a new user
  addUser(user: User): void {
    const users = this.getUsers();
    user.id = new Date().getTime(); // Assign a unique ID based on timestamp
    users.push(user);
    this.saveUsers(users);
  }

  // Update an existing user
  updateUser(updatedUser: User): void {
    const users = this.getUsers().map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.saveUsers(users);
  }

  // Delete a user by ID
  deleteUser(userId: number): void {
    const users = this.getUsers().filter((user) => user.id !== userId);
    this.saveUsers(users);
  }
}
