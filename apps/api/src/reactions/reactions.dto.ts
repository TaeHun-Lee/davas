import { REACTION_EMOJIS, type ReactionEmoji } from '@davas/shared';
import { IsIn } from 'class-validator';
export class CreateReactionDto { @IsIn(REACTION_EMOJIS) emoji!: ReactionEmoji; }
