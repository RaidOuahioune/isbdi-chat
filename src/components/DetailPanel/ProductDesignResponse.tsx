import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
import ReactMarkdown from 'react-markdown';

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
        
        <Typography variant="h6" sx={{ mt: 2 }}>Original Requirements </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <ReactMarkdown>{`**Objective:** ${data.original_requirements.product_objective}`}</ReactMarkdown>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <ReactMarkdown>{`**Risk Appetite:** ${data.original_requirements.risk_appetite}`}</ReactMarkdown>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <ReactMarkdown>{`**Investment Tenor:** ${data.original_requirements.investment_tenor}`}</ReactMarkdown>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <ReactMarkdown>{`**Target Audience:** ${data.original_requirements.target_audience}`}</ReactMarkdown>
          </Typography>
          {data.original_requirements.asset_focus && (
            <Typography variant="body2" color="text.secondary">
              <ReactMarkdown>{`**Asset Focus:** ${data.original_requirements.asset_focus}`}</ReactMarkdown>
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            <ReactMarkdown>{`**Desired Features:** ${data.original_requirements.desired_features.join(', ')}`}</ReactMarkdown>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <ReactMarkdown>{`**Specific Exclusions:** ${data.original_requirements.specific_exclusions.join(', ')}`}</ReactMarkdown>
          </Typography>
          {data.original_requirements.additional_notes && (
            <Typography variant="body2" color="text.secondary">
              <ReactMarkdown>{`**Additional Notes:** ${data.original_requirements.additional_notes}`}</ReactMarkdown>
            </Typography>
          )}
        </Box>

        <Typography variant="h6" sx={{ mt: 2 }}>Recommended Islamic Contracts</Typography>
        <List dense>
          {data.recommended_islamic_contracts.map((contract, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={<ReactMarkdown>{`• ${contract}`}</ReactMarkdown>} 
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 2 }}>Rationale for Contract Selection</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <ReactMarkdown>{data.rationale_for_contract_selection}</ReactMarkdown>
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Proposed Product Structure</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <ReactMarkdown>{data.proposed_product_structure_overview}</ReactMarkdown>
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>AAOIFI FAS Considerations</Typography>
        <Box sx={{ mb: 2 }}>
          {Object.entries(data.key_aaoifi_fas_considerations).map(([key, value]) => {
            // Skip if not a numbered key (we only want to process the pattern properties with numeric keys)
            if (!/^\d+$/.test(key)) return null;
            
            const consideration = value as {
              standard_id: string;
              query: string;
              extracted_info: string;
            };
            
            return (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  <ReactMarkdown>{`**FAS ${consideration.standard_id}**`}</ReactMarkdown>
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                  <ReactMarkdown>{consideration.query}</ReactMarkdown>
                </Typography>
                <Typography variant="body2">
                  <ReactMarkdown>{consideration.extracted_info}</ReactMarkdown>
                </Typography>
                {parseInt(key) < Object.keys(data.key_aaoifi_fas_considerations).length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            );
          })}
        </Box>

        <Typography variant="h6" sx={{ mt: 2 }}>Shariah Compliance Checkpoints</Typography>
        <List dense>
          {data.shariah_compliance_checkpoints.map((checkpoint, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={<ReactMarkdown>{`• ${checkpoint}`}</ReactMarkdown>} 
              />
            </ListItem>
          ))}
        </List>

        {data.potential_areas_of_concern.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>Potential Areas of Concern</Typography>
            <List dense>
              {data.potential_areas_of_concern.map((concern, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={<ReactMarkdown>{`• ${concern}`}</ReactMarkdown>} 
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>Risks and Mitigation</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <ReactMarkdown>{data.potential_risks_and_mitigation_notes}</ReactMarkdown>
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Next Steps for Detailed Design</Typography>
        <List dense>
          {data.next_steps_for_detailed_design.map((step, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={<ReactMarkdown>{`${index + 1}. ${step}`}</ReactMarkdown>} 
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProductDesignResponse;
