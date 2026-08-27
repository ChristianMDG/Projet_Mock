import { Box, Typography } from '@mui/material';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface TypingIndicatorProps {
  typingUsers: string[];
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  const { t } = useTranslation();

  const hasTypingUsers = typingUsers.length > 0;
  const isSingleTypingUser = typingUsers.length === 1;

  return (
    <Box sx={{ px: 2, py: 0.5, minHeight: 24 }}>
      {hasTypingUsers && (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {isSingleTypingUser
            ? t(Labels.msg_typing_one, { user: typingUsers[0] })
            : t(Labels.msg_typing_many, { count: typingUsers.length })}
        </Typography>
      )}
    </Box>
  );
}
