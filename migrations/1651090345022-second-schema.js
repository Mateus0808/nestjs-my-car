import { MigrationInterface, QueryRunner } from 'typeorm';

module.exports = class secondSchema1651090345022 {
  name = 'secondSchema1651090345022';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" integer PRIMARY KEY AUTOINCREMENT, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "long" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_reports" ("id" integer PRIMARY KEY AUTOINCREMENT, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "long" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer, CONSTRAINT "FK_bed415cd29716cd707e9cb3c09c" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_reports"("id", "approved", "price", "make", "model", "year", "long", "lat", "mileage", "userId") SELECT "id", "approved", "price", "make", "model", "year", "long", "lat", "mileage", "userId" FROM "reports"`,
    );
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_reports" RENAME TO "reports"`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "reports" RENAME TO "temporary_reports"`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" integer PRIMARY KEY AUTOINCREMENT, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "long" integer NOT NULL, "lat" integer NOT NULL, "mileage" integer NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "reports"("id", "approved", "price", "make", "model", "year", "long", "lat", "mileage", "userId") SELECT "id", "approved", "price", "make", "model", "year", "long", "lat", "mileage", "userId" FROM "temporary_reports"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_reports"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
};
