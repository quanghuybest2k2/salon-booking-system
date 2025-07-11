import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { NotificationType, NotificationStatus } from 'src/common/enums';
import { Appointment } from '../appointment/appointment.entity';
import { User } from '../user/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose()
  id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column({ type: 'bigint' })
  appointment_id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'enum', enum: NotificationType })
  @Expose()
  type: NotificationType;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    precision: null,
  })
  @Expose()
  sent_at: Date;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  @Expose()
  status: NotificationStatus;

  @Column({ type: 'text', nullable: true })
  @Expose()
  message: string;
}
