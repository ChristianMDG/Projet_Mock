import React from 'react';
import { Box, CardContent, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ROWS = 5;

const ColisListSkeleton: React.FC = () => (
  <Box>
    <CardContent>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Expéditeur</TableCell>
            <TableCell>Tél. Expéditeur</TableCell>
            <TableCell>Destinataire</TableCell>
            <TableCell>Tél. Destinataire</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Poids (kg)</TableCell>
            <TableCell>Prix</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: ROWS }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 9 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton variant="text" width={j === 0 ? 20 : 80} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Box>
);

export default ColisListSkeleton;
