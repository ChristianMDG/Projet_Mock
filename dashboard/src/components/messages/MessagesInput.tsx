import { Box, IconButton, TextField } from '@mui/material';
import { Send as SendIcon, EmojiEmotionsOutlined as EmojiIcon, MicNoneOutlined as MicIcon } from '@mui/icons-material';
import Labels from '@/labelKeys.json';
import { WHATSAPP_COLORS } from './constants';

interface MessagesInputProps {
  textValue: string;
  setTextValue: (v: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSend: () => void;
  isConnected: boolean;
  t: (k: string) => string;
}

export default function MessagesInput({
  textValue,
  setTextValue,
  handleKeyDown,
  handleSend,
  isConnected,
  t,
}: MessagesInputProps) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        p: 1.5,
        bgcolor: WHATSAPP_COLORS.headerBg,
        borderTop: `1px solid ${WHATSAPP_COLORS.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
        <IconButton size="small" sx={{ color: WHATSAPP_COLORS.iconColor, mb: 0.5 }}>
          <EmojiIcon />
        </IconButton>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder={t(Labels.msg_input_placeholder)}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: WHATSAPP_COLORS.bgInputInner,
              borderRadius: '8px',
              '& fieldset': { border: 'none' },
            },
            '& .MuiOutlinedInput-input': { py: 0.5, px: 1 },
          }}
        />
        {textValue.trim() ? (
          <IconButton color="primary" onClick={handleSend} disabled={!isConnected} sx={{ mb: 0.5 }}>
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton size="small" sx={{ color: WHATSAPP_COLORS.iconColor, mb: 0.5 }}>
            <MicIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
