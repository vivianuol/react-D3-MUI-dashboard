import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import MoneyIcon from '@material-ui/icons/Money';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import * as d3 from 'd3';
import { json } from 'd3-fetch';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  progress: {
    marginTop: theme.spacing(3)
  }
}));

const DeathRate = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const deathRef = useRef(null);
  const rateRef = useRef(null);

  const [trend, setTrend] = useState('up');
  
  const switchURL = () => {
  if ( props.state == '' ) {
    return json("https://covidtracking.com/api/us/daily")
  } else {
    return json(`https://covidtracking.com/api/states/daily?state=${props.state}`)
  }
};

  useEffect(() => {

    d3.select(rateRef.current).selectAll('p').text('');
    console.log("~~~~~~~~~~~~~~~")
    
    switchURL().then(data=>{
      console.log("covid-19 daily data")
        console.log(data)

      var today = data[0].death;
      var yesterday = data[1].death;

      var deathRate = Math.round(((today - yesterday)/yesterday)*100) + "%";

      if(deathRate <0 ) {
        setTrend('down')
      }

      d3.select(deathRef.current)
        .text(today)

      d3.select(rateRef.current)
      .append("p")
      .text(deathRate)
    })
  },[props.state])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Fatality Rate
              </Typography>
              <Typography 
                variant="h3"
                ref={deathRef}
                >
              </Typography>
            </Grid>
          </Grid>
         
          <div className={classes.difference}>
              { trend == 'up'?  <ArrowUpwardIcon className={classes.differenceIcon} /> : <ArrowDownwardIcon className={classes.differenceIcon} />}
          <Typography
            className={classes.differenceValue}
            variant="body2"
            ref={rateRef}
          ></Typography>
          <Typography
            className={classes.caption}
            variant="caption"
          >
            Since yesterday
          </Typography>
          </div>
      </CardContent>
    </Card>
  );
};

DeathRate.propTypes = {
  className: PropTypes.string
};

export default DeathRate;
