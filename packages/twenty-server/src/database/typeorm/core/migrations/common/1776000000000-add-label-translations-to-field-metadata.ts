import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLabelTranslationsToFieldMetadata1776000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."fieldMetadata"
         ADD COLUMN IF NOT EXISTS "labelTranslations" jsonb,
         ADD COLUMN IF NOT EXISTS "optionLabelTranslations" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."fieldMetadata"
         DROP COLUMN IF EXISTS "labelTranslations",
         DROP COLUMN IF EXISTS "optionLabelTranslations"`,
    );
  }
}
