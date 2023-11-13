"""empty message

Revision ID: d32d2fd2289f
Revises: 5a680278a836
Create Date: 2023-11-13 23:32:27.390259

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd32d2fd2289f'
down_revision = '5a680278a836'
branch_labels = None
depends_on = None


def upgrade():
    op.execute('ALTER TABLE `user` ADD COLUMN `name` VARCHAR(255) NOT NULL AFTER `user_name`;')
    op.execute('ALTER TABLE `user` ADD COLUMN `date_of_birth` DATE NOT NULL AFTER `name`;')
    op.execute('ALTER TABLE `user` ADD COLUMN `gender` VARCHAR(10) NOT NULL AFTER `name`;')
    pass


def downgrade():
    op.drop_column('user', 'name')
    op.drop_column('user', 'date_of_birth')
    op.drop_column('user', 'gender')
    pass
