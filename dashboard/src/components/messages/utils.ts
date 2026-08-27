import dayjs from '@/utils/dayjsConfig';
import { Message } from '@/models';

export interface MessageGroup {
  messages: Message[];
  senderId: string;
}

export function formatLastActivity(lastActivity?: string): string {
  if (lastActivity) {
    const d = dayjs(lastActivity);
    if (d.isValid()) {
      const now = dayjs();
      const diffMins = now.diff(d, 'minute');
      if (diffMins < 1) return "À l'instant";
      if (diffMins < 60) return `${diffMins}m`;
      const diffHours = now.diff(d, 'hour');
      if (diffHours < 24) return `${diffHours}h`;
      const diffDays = now.diff(d, 'day');
      if (diffDays < 7) return `${diffDays}j`;
      return d.format('DD MMM');
    }
  }
  return '';
}

export function isSameDay(a: string, b: string): boolean {
  return dayjs(a).isSame(dayjs(b), 'day');
}

export function humanizeRoomTitle(chat: { title?: string; roomId: string; participants?: string }): string {
  return chat.roomId;
}

export function formatMessageTime(createdAt?: string): string {
  if (createdAt) {
    const d = dayjs(createdAt);
    return d.isValid() ? d.format('HH:mm') : '';
  }
  return '';
}

export function formatMessageDateTime(createdAt?: string): string {
  if (createdAt) {
    const d = dayjs(createdAt);
    if (d.isValid()) {
      const isToday = d.isSame(dayjs(), 'day');
      const isYesterday = d.isSame(dayjs().subtract(1, 'day'), 'day');
      const dateLabel = isToday ? "Aujourd'hui" : isYesterday ? 'Hier' : d.format('DD/MM/YYYY');
      return `${dateLabel} à ${d.format('HH:mm')}`;
    }
  }
  return '';
}

export function groupMessages(
  messages: Message[]
): Array<{ type: 'divider'; date: string } | { type: 'group'; group: MessageGroup }> {
  const result: Array<{ type: 'divider'; date: string } | { type: 'group'; group: MessageGroup }> = [];
  let lastDate: string | null = null;
  let currentGroup: MessageGroup | null = null;

  for (const msg of messages) {
    const msgDate = msg.createdAt;
    const isSameDate = lastDate !== null && isSameDay(lastDate, msgDate);

    if (isSameDate) {
      // Continuer dans le même jour
    } else {
      if (currentGroup) {
        result.push({ type: 'group', group: currentGroup });
        currentGroup = null;
      }
      result.push({ type: 'divider', date: msgDate });
      lastDate = msgDate;
    }

    if (currentGroup) {
      const last = currentGroup.messages[currentGroup.messages.length - 1];
      const timeDiff = new Date(msgDate).getTime() - new Date(last.createdAt).getTime();
      const sameGroupSender = msg.senderId === currentGroup.senderId && timeDiff < 5 * 60000;

      if (sameGroupSender) {
        currentGroup.messages.push(msg);
      } else {
        result.push({ type: 'group', group: currentGroup });
        currentGroup = { messages: [msg], senderId: msg.senderId };
      }
    } else {
      currentGroup = { messages: [msg], senderId: msg.senderId };
    }
  }

  if (currentGroup) {
    result.push({ type: 'group', group: currentGroup });
  }

  return result;
}

export function formatMessageDate(createdAt?: string): string {
  if (createdAt) {
    const d = dayjs(createdAt);
    if (d.isValid()) {
      const diffDays = dayjs().startOf('day').diff(d.startOf('day'), 'day');
      if (diffDays === 0) return "Aujourd'hui";
      if (diffDays === 1) return 'Hier';
      return d.format('dddd D MMMM');
    }
  }
  return '';
}
