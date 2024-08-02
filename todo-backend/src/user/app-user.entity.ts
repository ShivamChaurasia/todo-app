import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../database/abstract.entity';
import { Todo } from '../todo/todo.entity';

@Entity('app_user')
export class AppUser extends AbstractEntity<AppUser> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[]; // Collection of todo items associated with this user
}
