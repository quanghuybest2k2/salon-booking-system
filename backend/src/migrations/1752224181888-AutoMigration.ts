import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1752224181888 implements MigrationInterface {
    name = 'AutoMigration1752224181888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`appointment_id\` bigint NOT NULL, \`user_id\` bigint NOT NULL, \`type\` enum ('CONFIRMATION', 'CANCELLATION', 'REMINDER') NOT NULL, \`sent_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`status\` enum ('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING', \`message\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`customer_id\` bigint NOT NULL, \`service_id\` bigint NOT NULL, \`provider_id\` bigint NOT NULL, \`start_time\` datetime NOT NULL, \`end_time\` datetime NOT NULL, \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING', \`notes\` text NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX \`idx_appointments_time\` (\`provider_id\`, \`start_time\`, \`end_time\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`services\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`provider_id\` bigint NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`duration_minutes\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`provider_availability\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`provider_id\` bigint NOT NULL, \`day_of_week\` enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service_providers\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`user_id\` bigint NOT NULL, \`business_name\` varchar(100) NOT NULL, \`address\` text NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`full_name\` varchar(100) NOT NULL, \`phone_number\` varchar(20) NULL, \`role\` enum ('customer', 'admin', 'provider') NOT NULL DEFAULT 'customer', \`refreshToken\` varchar(255) NULL, \`refreshTokenExpiry\` timestamp NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX \`idx_users_email\` (\`email\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9e2d01428faefb60e63c287c04a\` FOREIGN KEY (\`appointment_id\`) REFERENCES \`appointments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_2be3c78815aba227af1c3e8e413\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_2a2088e8eaa8f28d8de2bdbb857\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_e3e268ed1125872144e68b9a41c\` FOREIGN KEY (\`provider_id\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`services\` ADD CONSTRAINT \`FK_e7a40b21f8fd548be206fcc89b2\` FOREIGN KEY (\`provider_id\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`provider_availability\` ADD CONSTRAINT \`FK_d60be36a0bfa87bd223620fe260\` FOREIGN KEY (\`provider_id\`) REFERENCES \`service_providers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_providers\` ADD CONSTRAINT \`FK_2cc7c52b39288cadfad8a0ad63c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`service_providers\` DROP FOREIGN KEY \`FK_2cc7c52b39288cadfad8a0ad63c\``);
        await queryRunner.query(`ALTER TABLE \`provider_availability\` DROP FOREIGN KEY \`FK_d60be36a0bfa87bd223620fe260\``);
        await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_e7a40b21f8fd548be206fcc89b2\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_e3e268ed1125872144e68b9a41c\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_2a2088e8eaa8f28d8de2bdbb857\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_2be3c78815aba227af1c3e8e413\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9e2d01428faefb60e63c287c04a\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`idx_users_email\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`service_providers\``);
        await queryRunner.query(`DROP TABLE \`provider_availability\``);
        await queryRunner.query(`DROP TABLE \`services\``);
        await queryRunner.query(`DROP INDEX \`idx_appointments_time\` ON \`appointments\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
    }

}
