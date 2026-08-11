import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton } from '@mui/material';

const PopularRoutesSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Skeleton variant="text" width="80%" height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="80%" height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="60%" height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="70%" height={20} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width="50%" height={20} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4, 5].map(index => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width="90%" height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="90%" height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="70%" height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="80%" height={24} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Skeleton variant="text" width="60%" height={16} sx={{ mt: 2 }} />
  </Box>
);

export default PopularRoutesSkeleton;
