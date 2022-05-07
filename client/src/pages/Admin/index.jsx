import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Container, Typography } from '@mui/material';

function Admin() {
  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item md={8}>
          <Grid item>
            <Typography variant="h4" gutterBottom>Գլխավոր էջ</Typography>
            <Typography variant="subtitle2" gutterBottom>
              This is demo app with login, registration and updating profile
              flows.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Admin;
