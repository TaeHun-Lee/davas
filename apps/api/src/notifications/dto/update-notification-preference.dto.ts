import { IsBoolean, IsIn } from 'class-validator';
import {
  NOTIFICATION_PREFERENCE_CATEGORIES,
  NotificationPreferenceCategory,
} from '../../database/entities';

export class UpdateNotificationPreferenceDto {
  @IsIn(NOTIFICATION_PREFERENCE_CATEGORIES)
  category!: NotificationPreferenceCategory;

  @IsBoolean()
  enabled!: boolean;
}
