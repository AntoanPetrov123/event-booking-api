import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import type { Relation } from "typeorm";
  
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Ticket } from '../../tickets/entities/ticket.entity.js';
  
@ObjectType()
@Entity('events')
export class Event {
    @Field(() => ID)
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Field()
    @Column()
    title: string;
  
    @Field()
    @Column()
    hall: string;
  
    @Field()
    @Column()
    city: string;
  
    @Field()
    @Column({ type: 'text' })
    description: string;
  
    @Field(() => String)
    @Column({ type: 'date' })
    startDate: string;

    @Field(() => String)
    @Column({ type: 'date' })
    endDate: string;
  
    @Field()
    @Column({ type: 'time' })
    startTime: string;

    @Field()
    @Column({ type: 'time' })
    endTime: string;
  
    @Field({ nullable: true })
    @Column({ nullable: true })
    image?: string;
  
    @Field()
    @Column({ default: 'PENDING' })
    status: string;
  
    @Field()
    @CreateDateColumn()
    createdAt: Date;
  
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => [Ticket], { nullable: true })
    @OneToMany(
        () => Ticket,
        (ticket) => ticket.event
    )
    tickets: Relation<Ticket[]>;
}