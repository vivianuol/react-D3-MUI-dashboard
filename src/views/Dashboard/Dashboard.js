import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { spacing } from '@material-ui/system';
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button } from '@material-ui/core';
import * as d3 from 'd3';
import { json } from 'd3-fetch';

import {
  TestPositive,
  Hospitalized,
  DeathRate,
  Total,
  AbsoluteCases,
  IncreasedCases,
  SimpleSelect
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

  const [stateUS, setStateUS] = useState('');

  // const onChange = (s)=> {
  //   console.log('selected state')
  //   console.log(s);
  //   return setStateUS(s);
  // }


  useEffect(()=> {
    
    
    // d3.select(myHeader1Ref.current)
    //   .append('div')
    //   .attr('class', 'title')
    //   .text('Case Summary')
    //   .style('color', '#784a62')
    //   .style('padding','5px')
    

        json('https://covidtracking.com/api/us/daily').then(data=>{
          console.log(data[0].dateChecked)

        d3.select(myHeader1Ref.current)
          .append('p')
          .text(`updated at: ${data[0].dateChecked}`)
          .style('font-size','12px')
          .style('padding','8px')
        })


  },[])
   

  return (
    <div className={classes.root}>
      <Grid className={classes.section} container spacing={2}>
        
        <Grid item xs={12}>
          <Card className={classes.paper}>
          <CardHeader
              className={classes.title}
              color="textSecondary"
              variant="h3"
              ref={myHeader1Ref}
            />
            <Divider />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.paper}>
          <SimpleSelect selectState={s => {
            console.log('selected state')
            console.log(s);
            console.log(stateUS);
            return setStateUS(s)
          } }/>
          </Card>
        </Grid>

        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TestPositive state={stateUS}/>
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Hospitalized state={stateUS}/>
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <DeathRate state={stateUS}/>
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Total state={stateUS}/>
        </Grid>
      </Grid>
        
        <Grid className={classes.section} container spacing={2}>

        <Grid
          item
          lg={6}
          xs={12}
        >
          <AbsoluteCases state={stateUS}/>
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
        >
          <IncreasedCases state={stateUS}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
