import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Message, MessageType } from '@/models';
import { formatMessageTime, formatMessageDateTime } from './utils';
import { WHATSAPP_COLORS } from './constants';

const SYSTEM_KEY_PATTERN = /^[a-z][a-z0-9_]+$/;

interface MessageItemProps {
  message: Message;
  isFromCurrent: boolean;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
}

const SystemMessage = ({ message, t }: { message: Message; t: any }) => {
  const raw = message.content ?? '';
  const display = SYSTEM_KEY_PATTERN.test(raw) ? t(raw, { defaultValue: raw }) : raw;
  return (
    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.disabled', py: 0.5 }}>
      {display}
    </Typography>
  );
};

const UserMessage = ({ message, isFromCurrent, isFirstInGroup, isLastInGroup }: any) => {
  const isOtherUser = !isFromCurrent;
  const showAvatar = isOtherUser && isFirstInGroup;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isFromCurrent ? 'flex-end' : 'flex-start',
        mb: isLastInGroup ? 1.5 : 0.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isFromCurrent ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isFromCurrent ? 'flex-end' : 'flex-start',
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: isFromCurrent ? WHATSAPP_COLORS.msgBgCurrent : WHATSAPP_COLORS.msgBgOther,
              color: WHATSAPP_COLORS.textSecondary,
              borderRadius: '8px',
              borderTopRightRadius: isFromCurrent && isFirstInGroup ? '0px' : '8px',
              borderTopLeftRadius: showAvatar ? '0px' : '8px',
              boxShadow: WHATSAPP_COLORS.dateBadgeShadow,
              wordBreak: 'break-word',
              position: 'relative',
              minWidth: 100,
            }}
          >
            {showAvatar && (
              <Typography
                variant="caption"
                sx={{ color: WHATSAPP_COLORS.msgSenderName, fontWeight: 600, display: 'block', mb: 0.5 }}
              >
                {message.senderName ?? 'Support'}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.4, mr: 2 }}>
                {message.content}
              </Typography>
              <Tooltip title={formatMessageDateTime(message.createdAt)} placement="top" arrow>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.disabled',
                    fontSize: '0.7rem',
                    lineHeight: 1,
                    mt: 1,
                    cursor: 'default',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatMessageTime(message.createdAt)}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function MessageItem({ message, isFromCurrent, isLastInGroup, isFirstInGroup }: MessageItemProps) {
  const { t } = useTranslation();
  const isSystem = Boolean(message.isSystem || message.type === MessageType.SYSTEM);

  if (isSystem) {
    return <SystemMessage message={message} t={t} />;
  }

  return (
    <UserMessage
      message={message}
      isFromCurrent={isFromCurrent}
      isFirstInGroup={isFirstInGroup}
      isLastInGroup={isLastInGroup}
    />
  );
}
