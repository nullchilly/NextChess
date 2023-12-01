"""empty message

Revision ID: f89c0ca39f21
Revises: d32d2fd2289f
Create Date: 2023-11-17 00:44:43.759200

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f89c0ca39f21'
down_revision = 'd32d2fd2289f'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""insert into variants(`id`, `variant_name`, `description`) values (1, "Standard", "Standard"), (2, "Chess960", "Chess960");""")
    pass


def downgrade():
    op.execute("""DELETE FROM variants WHERE id IN (1, 2);""")
    pass
