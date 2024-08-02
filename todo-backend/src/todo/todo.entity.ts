import { Entity, Column, ManyToOne } from 'typeorm';
import { AppUser } from '../user/app-user.entity'; // Import User entity
import { AbstractEntity } from '../database/abstract.entity';

@Entity()
export class Todo extends AbstractEntity<Todo> {
  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => AppUser, (user) => user.todos, { eager: false })
  user: AppUser; // Reference to the user who owns this TODO
}
