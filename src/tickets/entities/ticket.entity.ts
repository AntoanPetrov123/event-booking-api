import { 
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn 
} from "typeorm";

import type { Relation } from "typeorm";

import { Event } from "../../events/entities/event.entity.js";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity("tickets")
export class Ticket {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  eventId: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Float)
  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  price: number;

  @Field(() => Float, {nullable: true})
  @Column("decimal", {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountPrice?: number | null;

  @Field(() => Int)
  @Column()
  totalPlaces: number;

  @Field(() => Int)
  @Column({ default: 0 })
  usedPlaces: number;

  @Field(() => Int)
  @Column({ default: 0 })
  reservedPlaces: number;

  @ManyToOne(
    () => Event,
    (event) => event.tickets,
    {
      onDelete: "CASCADE",
    }
  )

  @JoinColumn({ name: "eventId" })
  event: Relation<Event>;;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}