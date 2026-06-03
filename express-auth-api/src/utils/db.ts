import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  name: string;
}

// In-memory mock database
export const users: User[] = [
  {
    id: "1",
    email: "admin@beecrypt.io",
    // password: 'adminpassword'
    passwordHash: bcrypt.hashSync("adminpassword", 10),
    role: "ADMIN",
    name: "Admin User",
  },
  {
    id: "2",
    email: "user@beecrypt.io",
    // password: 'userpassword'
    passwordHash: bcrypt.hashSync("userpassword", 10),
    role: "USER",
    name: "Regular User",
  },
];

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((u) => u.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find((u) => u.id === id);
};
