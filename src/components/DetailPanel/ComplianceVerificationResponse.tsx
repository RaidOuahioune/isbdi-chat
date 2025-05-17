import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip
} from '@mui/material';

import { ComplianceVerificationResponseData } from './types';

interface ComplianceVerificationResponseProps {
  data: ComplianceVerificationResponseData;
}

const getStatusColor = (statusCode: string) => {
  switch (statusCode) {
    case 'compliant':
      return 'success';
    case 'partial':
      return 'warning';
    case 'missing':
      return 'error';
    default:
      return 'default';
  }
};

export const ComplianceVerificationResponse: React.FC<ComplianceVerificationResponseProps> = ({ data }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Compliance Verification Report: {data.document_name}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Verified on: {new Date(data.timestamp).toLocaleString()}
        </Typography>

        <div style={{ margin: '16px 0', padding: '16px', backgroundColor: 'white', borderRadius: '4px' }}>
          <Typography variant="h6" gutterBottom>Summary</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {data.compliance_report}
          </Typography>
        </div>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Detailed Compliance Check</Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Standard</TableCell>
                <TableCell>Requirement</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.structured_report.map((item, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {item.standard}
                  </TableCell>
                  <TableCell>{item.requirement}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={item.status} 
                      color={getStatusColor(item.status_code)} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{item.comments || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Original Document</Typography>
        <div 
          style={{ 
            padding: '16px', 
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            maxHeight: '300px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            border: '1px solid #e0e0e0'
          }}
        >
          {data.document}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceVerificationResponse;
