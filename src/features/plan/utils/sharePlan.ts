import { Share } from 'react-native';
import { PlanItem } from '../types/plan.types';

export const sharePlan = async (
  items: PlanItem[],
  cityName: string,
  totalDays: number
): Promise<void> => {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  let text = `🗺️ ${cityName} Seyahat Planı\n`;
  text += '━'.repeat(30) + '\n\n';

  for (const day of days) {
    const dayItems = items
      .filter((i) => i.day === day)
      .sort((a, b) => a.order - b.order);

    if (dayItems.length === 0) continue;

    text += `📅 Gün ${day}\n`;
    text += '─'.repeat(20) + '\n';

    dayItems.forEach((item, idx) => {
      const time = item.time ? `${item.time} - ` : '';
      text += `  ${idx + 1}. ${time}${item.placeName}\n`;
      if (item.note) {
        text += `     💬 ${item.note}\n`;
      }
    });

    text += '\n';
  }

  text += '🌐 City Explorer ile oluşturuldu';

  await Share.share({
    title: `${cityName} Seyahat Planı`,
    message: text,
  });
};
