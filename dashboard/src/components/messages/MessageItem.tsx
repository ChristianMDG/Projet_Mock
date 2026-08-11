import { Box, Typography, Avatar } from '@mui/material';
import { Message, MessageType } from '@/models';
import { formatMessageTime } from './utils';

interface MessageItemProps {
  message: Message;
  showAvatar: boolean;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
}

export default function MessageItem({ message, showAvatar, isLastInGroup, isFirstInGroup }: MessageItemProps) {
  const isSystem = message.isSystem || message.type === MessageType.SYSTEM;

  if (isSystem) {
    return (
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.disabled', py: 0.5 }}>
        {message.content}
      </Typography>
    );
  }

  const isFromCurrent = message.isFromCurrent;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isFromCurrent ? 'flex-end' : 'flex-start',
      }}
    >
      {!isFromCurrent && isFirstInGroup && (
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: '36px', mb: 0.25 }}>
          {message.senderName ?? ''}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 0.75,
          ...(isFromCurrent ? { flexDirection: 'row-reverse' } : {}),
        }}
      >
        {!isFromCurrent &&
          (showAvatar ? (
            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', flexShrink: 0 }}>
              {(message.senderName ?? '?').charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Box sx={{ width: 28, flexShrink: 0 }} />
          ))}
        <Box sx={{ maxWidth: '75%' }}>
          <Box
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: isFromCurrent ? 'primary.main' : 'background.paper',
              color: isFromCurrent ? 'primary.contrastText' : 'text.primary',
              borderRadius: isFromCurrent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              boxShadow: 1,
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body2">{message.content}</Typography>
          </Box>
          {isLastInGroup && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: isFromCurrent ? 'right' : 'left',
                mt: 0.25,
                color: isFromCurrent ? 'primary.contrastText' : 'text.disabled',
                opacity: isFromCurrent ? 0.7 : 1,
              }}
            >
              {formatMessageTime(message.createdAt)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
