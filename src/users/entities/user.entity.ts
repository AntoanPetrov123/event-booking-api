import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Event } from "../../events/entities/event.entity.js";
import type { Relation } from "typeorm";

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

@ObjectType()
@Entity("user_orders")
export class UserOrder {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Field()
  @Column()
  status: string;

  @Field()
  @Column()
  paymentStatus: string;

  @Field()
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

@ObjectType()
@Entity("user_order_items")
export class UserOrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  orderId: number;

  @Field()
  @Column()
  ticketId: number;

  @Field()
  @Column()
  eventId: number;

  @Field()
  @Column()
  ticketName: string;

  @Field()
  @Column()
  quantity: number;

  @Field()
  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  unitPrice: number;

  @Field()
  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  totalPrice: number;

  @Field(() => Event)
  @ManyToOne(() => Event)
  @JoinColumn({
    name: "eventId",
  })
  event: Relation<Event>;
}