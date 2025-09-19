import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Participant } from "./Participant";
import { OneToMany } from "typeorm";
  
  @Entity("events")
  export class Event {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ length: 150 })
    title!: string;
  
    @Column({ type: "text" })
    description!: string;
  
    @Column({ nullable: true })
    image!: string;
  
    @Column({ type: "date" })
    date!: string;
  
    @Column({ type: "varchar", length: 20 })
    time!: string;
  
    @Column({ length: 150 })
    venue!: string;
  
    @Column({ length: 100 })
    organiser!: string;
  
    @Column({ type: "int", default: 0 })
    participantLimit!: number;
  
    @Column({
        type: "varchar",
        length: 20,
        default: "Confirmed",
    })
    status!: "Confirmed" | "Waitlist";      
  
    @Column({ type: "int", default: 0 })
    participants!: number;
  
    @Column({ type: "int", default: 0 })
    waitlist!: number;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Participant, (participant) => participant.event)
    eventParticipants!: Participant[];
  }