"""empty message

Revision ID: 7ce64b27e610
Revises: 9c9c4bde4299
Create Date: 2023-11-05 22:35:36.620034

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7ce64b27e610'
down_revision = '9c9c4bde4299'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'profile',
        sa.Column('profile_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('dob', sa.DateTime, nullable=False),
        sa.Column('gender', sa.String(10), nullable=False),
        sa.Column('rating', sa.Integer, nullable=False),
        sa.Column('country', sa.String(30), nullable=False),
    )
    op.create_foreign_key('fk_user_profile', 'profile', 'user', ['user_id'], ['user_id'])

    op.create_table(
        'variants',
        sa.Column('variant_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('variant_name', sa.String(255), nullable=False),
        sa.Column('description', sa.String(255), nullable=False),
    )

    op.create_table(
        'chess_piece',
        sa.Column('piece_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.String(1000), nullable=False),
    )

    op.create_table(
        'game',
        sa.Column('game_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('variant_id', sa.Integer, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('current_timestamp')),
        sa.Column('end_at', sa.DateTime),
        sa.Column('status', sa.Boolean, nullable=False),
        sa.Column('result', sa.Integer, nullable=False),
    )
    op.create_foreign_key('fk_game_variant', 'game', 'variants', ['variant_id'], ['variant_id'])

    op.create_table(
        'move',
        sa.Column('move_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('game_id', sa.Integer, nullable=False),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('move_detail', sa.String(255), nullable=False),
        sa.Column('time_stamp', sa.DateTime, server_default=sa.text('current_timestamp')),
    )
    op.create_foreign_key('fk_move_game', 'move', 'game', ['game_id'], ['game_id'])
    op.create_foreign_key('fk_move_user', 'move', 'user', ['user_id'], ['user_id'])

    op.create_table(
        'game_user',
        sa.Column('game_user_id', sa.Integer, primary_key=True),
        sa.Column('game_id', sa.Integer, nullable=False),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('win', sa.Integer, nullable=False),
    )
    op.create_foreign_key('fk_game_game', 'game_user', 'game', ['game_id'], ['game_id'])

    op.create_table(
        'puzzle',
        sa.Column('puzzle_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('position', sa.String(50), nullable=False),
        sa.Column('rating', sa.Integer),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.text('current_timestamp')),
    )

    op.create_table(
        'solution',
        sa.Column('solution_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('puzzle_id', sa.Integer, nullable=False),
        sa.Column('solution', sa.String(1025), nullable=False),
    )
    op.create_foreign_key('fk_puzzle_solution', 'solution', 'puzzle', ['puzzle_id'], ['puzzle_id'])

    op.create_table(
        'puzzle_user',
        sa.Column('puzzle_user_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('puzzle_id', sa.Integer, nullable=False),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('state', sa.Integer, nullable=False),
        sa.Column('gained_rating', sa.Boolean, nullable=False),
        sa.Column('position', sa.String(255), nullable=False),
    )
    op.create_foreign_key('fk_puzzle_user_puzzle', 'puzzle_user', 'puzzle', ['puzzle_id'], ['puzzle_id'])
    op.create_foreign_key('fk_puzzle_user_user', 'puzzle_user', 'user', ['user_id'], ['user_id'])
    pass


def downgrade():
    op.drop_table('puzzle_user')
    op.drop_table('solution')
    op.drop_table('puzzle')
    op.drop_table('game_user')
    op.drop_table('move')
    op.drop_table('game')
    op.drop_table('chess_piece')
    op.drop_table('variants')
    op.drop_table('profile')
    op.drop_table('user')
    pass
