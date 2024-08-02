import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../database/abstract.entity';

@Entity('app_user')
export class AppUser extends AbstractEntity<AppUser> {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
