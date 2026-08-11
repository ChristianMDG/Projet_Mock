import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider,
  List,
  ListItem,
  Skeleton,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';

interface OperatorListSkeletonProps {
  groupCount?: number;
  operatorsPerGroup?: number;
}

const OperatorListSkeleton = ({ groupCount = 3, operatorsPerGroup = 2 }: OperatorListSkeletonProps) => (
  <Stack spacing={3}>
    {Array.from({ length: groupCount }).map((_, groupIdx) => (
      <Accordion
        key={groupIdx}
        expanded={groupIdx === 0}
        sx={{
          '&:before': { display: 'none' },
          boxShadow: 1,
          borderRadius: 2,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
            }}
          >
            <Skeleton
              variant="circular"
              sx={{
                width: 24,
                height: 24,
              }}
            />
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '40%' }} />
            <Box sx={{ flexGrow: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 80 }} />
          </Box>
        </AccordionSummary>
        {groupIdx === 0 && (
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {Array.from({ length: operatorsPerGroup }).map((_, opIdx) => (
                <Box key={opIdx}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          sx={{
                            width: 20,
                            height: 20,
                          }}
                        />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: 150 }} />
                      </Box>
                      <Skeleton
                        variant="rounded"
                        sx={{
                          borderRadius: 4,
                          width: 60,
                          height: 24,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          sx={{
                            width: 16,
                            height: 16,
                          }}
                        />
                        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 100 }} />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          sx={{
                            width: 16,
                            height: 16,
                          }}
                        />
                        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 80 }} />
                        <Skeleton
                          variant="circular"
                          sx={{
                            width: 32,
                            height: 32,
                          }}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  {opIdx < operatorsPerGroup - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </AccordionDetails>
        )}
      </Accordion>
    ))}
  </Stack>
);

export default OperatorListSkeleton;
