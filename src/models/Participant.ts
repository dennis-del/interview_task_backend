import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm"; 
import { Event } from "./Event"; 

@Entity() 
export class Participant { 
    @PrimaryGeneratedColumn() 
    id!: number; 
    
    @Column() 
    name!: string; 
    
    @Column() 
    email!: string; 
    
    @Column({ 
        type: "varchar", 
        length: 20, 
        default: "Waitlist", 
    }) 
    status!: "Waitlist" | "Confirmed"; 
    
    // 🔹 Add explicit eventId column
    @Column()
    eventId!: number;
    
    // 🔹 Fixed relationship with explicit JoinColumn
    @ManyToOne(() => Event, (event) => event.eventParticipants, { 
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "eventId" })
    event!: Event; 
    
    @CreateDateColumn() 
    createdAt!: Date; 
    
    @UpdateDateColumn() 
    updatedAt!: Date; 
}