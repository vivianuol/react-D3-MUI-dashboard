import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { spacing } from '@material-ui/system';
import { Grid, Card, CardContent, Typography, Paper } from '@material-ui/core';
import * as d3 from 'd3';

import {
  TestPositive,
  Hospitalized,
  DeathRate,
  Total,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  section: {
    margin: theme.spacing(2)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const myHeader1Ref = useRef(null);
  const myHeader2Ref = useRef(null);

  useEffect(()=> {
    console.log('select myRef');
    console.log(d3.select(myHeader1Ref));
    d3.select(myHeader1Ref.current)
      .append('div')
      .attr('class', 'title')
      .text('Case Summary')
      .style('color', '#784a62')
      .style('padding','5px')

    d3.select(myHeader2Ref.current)
          .append('div')
          .attr('class', 'title')
          .text('Charts')
          .style('color', '#e5c100')
          .style('padding','5px')

  })
   

  return (
    <div className={classes.root}>
      <Grid className={classes.section} container spacing={2}>
        <Grid item xs={12}>
          <Card className={classes.paper}>
          <Typography
              className={classes.title}
              color="textSecondary"
              variant="h3"
              ref={myHeader1Ref}
            >
          
            </Typography>
          </Card>
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TestPositive />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Hospitalized />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <DeathRate />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Total />
        </Grid>
      </Grid>
        
        <Grid className={classes.section} container spacing={2}>

        <Grid item xs={12}>
          <Card className={classes.paper}>
          <Typography
              className={classes.title}
              color="textSecondary"
              variant="h3"
              ref={myHeader2Ref}
            >
            </Typography>
          </Card>
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestSales />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <UsersByDevice />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <LatestProducts />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestOrders />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
