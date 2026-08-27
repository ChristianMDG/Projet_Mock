import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { MessageGroup } from './utils';
import { WHATSAPP_COLORS } from './constants';
import { formatMessageDate } from './utils';
import MessageItem from './MessageItem';

interface MessageListProps {
  groupedMessages: Array<{ type: 'divider'; date: string } | { type: 'group'; group: MessageGroup }>;
  messagesCount: number;
  userId?: number;
  userPhone?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  groupedMessages,
  messagesCount,
  userId,
  userPhone,
  messagesEndRef,
}: MessageListProps) {
  const { t } = useTranslation();

  if (messagesCount === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="text.secondary">{t(Labels.msg_no_messages)}</Typography>
      </Box>
    );
  }

  return (
    <>
      {groupedMessages.map((item, idx) => {
        if (item.type === 'divider') {
          return (
            <Box
              key={`divider-${idx}`}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1.5 }}
            >
              <Box
                sx={{
                  bgcolor: WHATSAPP_COLORS.dateBadgeBg,
                  color: WHATSAPP_COLORS.iconColor,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  boxShadow: WHATSAPP_COLORS.dateBadgeShadow,
                }}
              >
                {formatMessageDate(item.date).toUpperCase()}
              </Box>
            </Box>
          );
        }

        const { group } = item;
        const firstMsg = group.messages[0];

        const isFromCurrentGroup = Boolean(
          firstMsg.isFromCurrent ||
          firstMsg.isAgent ||
          group.senderId === String(userId) ||
          group.senderId === userPhone ||
          firstMsg.senderName?.startsWith('ADMIN')
        );

        return group.messages.map((message, msgIdx) => (
          <MessageItem
            key={message.messageId || `${idx}-${msgIdx}`}
            message={message}
            isFromCurrent={isFromCurrentGroup}
            isFirstInGroup={msgIdx === 0}
            isLastInGroup={msgIdx === group.messages.length - 1}
          />
        ));
      })}
      <Box ref={messagesEndRef} />
    </>
  );
}
