import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Transaction as TransactionEntity } from "entities/transaction-entity";

@Entity()
export class Chargeback {
  @PrimaryGeneratedColumn()
  chargebackId?: number;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.transactionId)
  @JoinColumn({ name: "chargeback_transaction_id" })
  chargebackTransaction: TransactionEntity;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.transactionId)
  @JoinColumn({ name: "target_transaction_id" })
  targetTransaction: TransactionEntity;

  @CreateDateColumn()
  createdAt?: string;
}
