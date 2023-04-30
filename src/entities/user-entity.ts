import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId?: number;

  @Column({ length: 36, nullable: false, unique: true })
  userGUID: string;

  @Column({ length: 11, nullable: false, unique: true })
  @Index("IDX_USER_DOCUMENT")
  document: string;

  @Column({ nullable: false })
  balance: number;

  @Column({ length: 32, nullable: false })
  firstName: string;

  @Column({ length: 32, nullable: false })
  lastName: string;

  @Column({ length: 64, nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt?: string;
}
