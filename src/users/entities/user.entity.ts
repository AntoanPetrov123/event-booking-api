import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Field()
    @Column({ type: 'text' })
    firstName: string;

    @Field()
    @Column({ type: 'text' })
    lastName: string;

    @Field()
    @Column({ type: 'text', unique: true })
    email: string;

    @Field()
    @Column({ type: 'text' })
    password: string;

    @Field()
    @Column({ default: 'USER' })
    role: string;

    @Field()
    @Column({ default: true })
    isActive: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;
  
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity("user_orders")
export class UserOrder {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column()
  status: string;

  @Column()
  paymentStatus: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  totalAmount: number;

  @Column({
    default: "EUR",
  })
  currency: string;

  @Column({ nullable: true })
  stripeSessionId: string;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @CreateDateColumn()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity("user_order_items")
export class UserOrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  orderId: number;

  @Column()
  ticketId: number;

  @Column()
  eventId: number;

  @Column()
  ticketName: string;

  @Column()
  quantity: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  unitPrice: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  totalPrice: number;
}