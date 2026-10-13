import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum IssuedTicketStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class IssuedTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  orderId: number;

  @Column()
  orderItemId: number;

  @Column()
  eventId: number;

  @Column()
  ticketId: number;

  @Column()
  ticketName: string;

  @Column({
    unique: true,
  })
  code: string;

  @Column({
    type: 'enum',
    enum: IssuedTicketStatus,
    default: IssuedTicketStatus.ACTIVE,
  })
  status: IssuedTicketStatus;

  @Column({
    nullable: true,
  })
  checkedInAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
