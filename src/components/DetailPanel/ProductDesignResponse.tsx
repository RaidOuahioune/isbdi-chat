import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

import { ProductDesignResponseData } from './types';

interface ProductDesignResponseProps {
  data: ProductDesignResponseData;
}

export const ProductDesignResponse: React.FC<ProductDesignResponseProps> = ({ data }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {data.suggested_product_concept_name}
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2 }}>Original Requirements</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          <strong>Objective:</strong> {data.original_requirements.product_objective}<br />
          <strong>Risk Appetite:</strong> {data.original_requirements.risk_appetite}<br />
          <strong>Investment Tenor:</strong> {data.original_requirements.investment_tenor}<br />
          <strong>Target Audience:</strong> {data.original_requirements.target_audience}<br />
          {data.original_requirements.asset_focus && (
            <><strong>Asset Focus:</strong> {data.original_requirements.asset_focus}<br /></>
          )}
          <strong>Desired Features:</strong> {data.original_requirements.desired_features.join(', ')}<br />
          <strong>Specific Exclusions:</strong> {data.original_requirements.specific_exclusions.join(', ')}<br />
          {data.original_requirements.additional_notes && (
            <><strong>Additional Notes:</strong> {data.original_requirements.additional_notes}</>
          )}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Recommended Islamic Contracts</Typography>
        <List dense>
          {data.recommended_islamic_contracts.map((contract, index) => (
            <ListItem key={index}>
              <ListItemText primary={`• ${contract}`} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 2 }}>Rationale for Contract Selection</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          {data.rationale_for_contract_selection}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Proposed Product Structure</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          {data.proposed_product_structure_overview}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>AAOIFI FAS Considerations</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          <strong>Standard ID:</strong> {data.key_aaoifi_fas_considerations.standard_id}
          {/* Add more AAOIFI considerations as needed */}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Shariah Compliance Checkpoints</Typography>
        <List dense>
          {data.shariah_compliance_checkpoints.map((checkpoint, index) => (
            <ListItem key={index}>
              <ListItemText primary={`• ${checkpoint}`} />
            </ListItem>
          ))}
        </List>

        {data.potential_areas_of_concern.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Potential Areas of Concern</Typography>
            <List dense>
              {data.potential_areas_of_concern.map((concern, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${concern}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>Risks and Mitigation</Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          {data.potential_risks_and_mitigation_notes}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Next Steps for Detailed Design</Typography>
        <List dense>
          {data.next_steps_for_detailed_design.map((step, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${step}`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProductDesignResponse;
