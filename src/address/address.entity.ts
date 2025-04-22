import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ nullable: true })
  housenumber: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  citycode: string;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;
}
