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
    op.drop_table('user')
    # Create the user table
    op.create_table('user',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('is_admin', sa.Boolean(), nullable=False),
                    sa.Column('user_name', sa.String(length=50), nullable=False),
                    sa.Column('password', sa.String(length=1025), nullable=False),
                    sa.Column('email', sa.String(length=255), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )

    # Create the profile table
    op.create_table('profile',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(length=50), nullable=False),
                    sa.Column('dob', sa.DateTime(), nullable=False),
                    sa.Column('gender', sa.String(length=10), nullable=False),
                    sa.Column('rating', sa.Integer(), nullable=False),
                    sa.Column('country', sa.String(length=30), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_user_profile')
                    )

    # Create the variants table
    op.create_table('variants',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('variant_name', sa.String(length=255), nullable=False),
                    sa.Column('description', sa.String(length=1000), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )

    # Create the chess_piece table
    op.create_table('chess_piece',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('name', sa.String(length=255), nullable=False),
                    sa.Column('description', sa.String(length=1000), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )

    # Create the game table
    op.create_table('game',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('variant_id', sa.Integer(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('end_at', sa.DateTime(), nullable=True),
                    sa.Column('status', sa.Boolean(), nullable=False),
                    # 2: Black win, 1: White win, 0: Draw
                    sa.Column('result', sa.Integer(), nullable=False),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['variant_id'], ['variants.id'], name='fk_game_variant')
                    )

    # Create the move table
    op.create_table('move',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('game_id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('move_detail', sa.String(length=255), nullable=False),
                    sa.Column('time_stamp', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['game_id'], ['game.id'], name='fk_move_game'),
                    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_move_user')
                    )

    # Create the game_user table
    op.create_table('game_user',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('game_id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('win', sa.Integer(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['game_id'], ['game.id'], name='fk_game_game')
                    )

    # Create the puzzle table
    op.create_table('puzzle',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('name', sa.String(length=255), nullable=False),
                    sa.Column('position', sa.String(length=2000), nullable=False),
                    sa.Column('rating', sa.Integer(), nullable=True),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id')
                    )

    # Create the solution table
    op.create_table('solution',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('puzzle_id', sa.Integer(), nullable=False),
                    sa.Column('solution', sa.String(length=2000), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['puzzle_id'], ['puzzle.id'], name='fk_puzzle_solution')
                    )

    # Create the puzzle_user table
    op.create_table('puzzle_user',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('puzzle_id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('state', sa.Integer(), nullable=False),
                    sa.Column('gained_rating', sa.Boolean(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['puzzle_id'], ['puzzle.id'], name='fk_puzzle_user_puzzle'),
                    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_puzzle_user_user')
                    )

    # Create indexes
    op.create_index('idx_user_name', 'user', ['user_name'])
    op.create_index('idx_user_email', 'user', ['email'])
    op.create_index('idx_user_profile', 'profile', ['user_id'])
    op.create_index('idx_game_variant', 'game', ['variant_id'])
    op.create_index('idx_game_user_game', 'game_user', ['game_id'])
    op.create_index('idx_game_user_user', 'game_user', ['user_id'])
    op.create_index('idx_move_game', 'move', ['game_id'])
    op.create_index('idx_move_user', 'move', ['user_id'])
    op.create_index('idx_puzzle_solution', 'solution', ['puzzle_id'])
    op.create_index('idx_puzzle_user_puzzle', 'puzzle_user', ['puzzle_id'])
    op.create_index('idx_puzzle_user_user', 'puzzle_user', ['user_id'])
    op.create_index('idx_puzzle_rating', 'puzzle', ['rating'])
    op.create_index('idx_game_status', 'game', ['status'])
    op.create_index('idx_game_result', 'game', ['result'])
    op.create_index('idx_game_end_at', 'game', ['end_at'])
    op.create_index('idx_game_created_at', 'game', ['created_at'])
    op.create_index('idx_game_updated_at', 'game', ['updated_at'])
    op.create_index('idx_game_deleted_at', 'game', ['deleted_at'])
    op.create_index('idx_move_created_at', 'move', ['created_at'])
    op.create_index('idx_move_updated_at', 'move', ['updated_at'])
    op.create_index('idx_move_deleted_at', 'move', ['deleted_at'])
    op.create_index('idx_game_user_created_at', 'game_user', ['created_at'])
    op.create_index('idx_game_user_updated_at', 'game_user', ['updated_at'])
    op.create_index('idx_game_user_deleted_at', 'game_user', ['deleted_at'])
    op.create_index('idx_puzzle_created_at', 'puzzle', ['created_at'])
    op.create_index('idx_puzzle_updated_at', 'puzzle', ['updated_at'])
    op.create_index('idx_puzzle_deleted_at', 'puzzle', ['deleted_at'])


def downgrade():
    # Drop the tables and indexes in reverse order
    op.drop_index('idx_puzzle_deleted_at', 'puzzle')
    op.drop_index('idx_puzzle_updated_at', 'puzzle')
    op.drop_index('idx_puzzle_created_at', 'puzzle')
    op.drop_index('idx_game_user_deleted_at', 'game_user')
    op.drop_index('idx_game_user_updated_at', 'game_user')
    op.drop_index('idx_game_user_created_at', 'game_user')
    op.drop_index('idx_move_deleted_at', 'move')
    op.drop_index('idx_move_updated_at', 'move')
    op.drop_index('idx_move_created_at', 'move')
    op.drop_index('idx_game_deleted_at', 'game')
    op.drop_index('idx_game_updated_at', 'game')
    op.drop_index('idx_game_created_at', 'game')
    op.drop_index('idx_game_end_at', 'game')
    op.drop_index('idx_game_result', 'game')
    op.drop_index('idx_game_status', 'game')
    op.drop_index('idx_puzzle_rating', 'puzzle')
    op.drop_index('idx_puzzle_user_user', 'puzzle_user')
    op.drop_index('idx_puzzle_user_puzzle', 'puzzle_user')
    op.drop_index('idx_puzzle_solution', 'solution')
    op.drop_index('idx_move_user', 'move')
    op.drop_index('idx_move_game', 'move')
    op.drop_index('idx_game_user_user', 'game_user')
    op.drop_index('idx_game_user_game', 'game_user')
    op.drop_index('idx_game_variant', 'game')
    op.drop_index('idx_user_profile', 'profile')
    op.drop_index('idx_user_email', 'user')
    op.drop_index('idx_user_name', 'user')
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
