// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export type UserRole = "Admin" | "Participant";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ type: "enum", enum: ["Admin", "Participant"], default: "Participant" })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}
