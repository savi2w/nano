import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User as UserEntity } from "entities/user-entity";

export enum TransactionType {
  CHARGE = "CHARGE",
  CHARGEBACK = "CHARGEBACK",
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId?: number;

  @Column({ length: 36, nullable: false, unique: true })
  transactionGUID: string;

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: "from_user_id" })
  fromUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.userId)
  @JoinColumn({ name: "to_user_id" })
  toUser: UserEntity;

  @Column({
    default: TransactionType.CHARGE,
    enum: TransactionType,
    nullable: false,
    type: "enum",
  })
  type?: TransactionType;

  @Column({ nullable: false })
  value: number;

  @CreateDateColumn()
  createdAt?: string;
}
