import { Type } from 'class-transformer';
import {
  type GroupRecommendationDecisionRequest,
  type GroupRecommendationFeedbackRequest,
  type GroupRecommendationSessionRequest,
  MEDIA_TYPES,
  RECOMMENDATION_DECISION_RULES,
  RECOMMENDATION_FEEDBACK_KINDS,
  RECOMMENDATION_REWATCH_POLICIES,
  SPACE_MAX_MEMBERS,
  SPACE_MIN_MEMBERS,
} from '@davas/shared';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import type {
  RecommendationDecisionRule,
  RecommendationFeedbackKind,
  RecommendationRewatchPolicy,
} from '../database/entities';

const CONTENT_TYPES = [...MEDIA_TYPES];
const REWATCH_POLICIES: RecommendationRewatchPolicy[] = [...RECOMMENDATION_REWATCH_POLICIES];
const DECISION_RULES: RecommendationDecisionRule[] = [...RECOMMENDATION_DECISION_RULES];
const FEEDBACK_KINDS: RecommendationFeedbackKind[] = [...RECOMMENDATION_FEEDBACK_KINDS];

export class RecommendationRuntimeDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  minMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  maxMinutes?: number;
}

export class CreateRecommendationSessionDto implements GroupRecommendationSessionRequest {
  @IsUUID()
  spaceId!: string;

  @IsArray()
  @ArrayMinSize(SPACE_MIN_MEMBERS)
  @ArrayMaxSize(SPACE_MAX_MEMBERS)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  participantAccountIds!: string[];

  @Matches(/^[A-Za-z]{2}$/)
  region!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  services!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ArrayUnique()
  @IsIn(CONTENT_TYPES, { each: true })
  contentTypes!: Array<'MOVIE' | 'TV'>;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecommendationRuntimeDto)
  runtime?: RecommendationRuntimeDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  moodTags?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  avoidTags?: string[];

  @IsIn(REWATCH_POLICIES)
  rewatchPolicy!: RecommendationRewatchPolicy;

  @IsIn(DECISION_RULES)
  decisionRule!: RecommendationDecisionRule;

  @ValidateIf((value: CreateRecommendationSessionDto) => value.decisionRule === 'MINIMUM')
  @IsInt()
  @Min(1)
  @Max(SPACE_MAX_MEMBERS)
  minimumApprovals?: number;
}

export class RecommendationFeedbackDto implements GroupRecommendationFeedbackRequest {
  @IsIn(FEEDBACK_KINDS)
  kind!: RecommendationFeedbackKind;

  @ValidateIf((value: RecommendationFeedbackDto) => value.kind === 'WATCHED')
  @IsUUID()
  watchEventId?: string;
}

/** "이걸로 볼게요": the agreed title someone settles on. */
export class DecideRecommendationDto implements GroupRecommendationDecisionRequest {
  @IsUUID()
  exposureId!: string;
}
