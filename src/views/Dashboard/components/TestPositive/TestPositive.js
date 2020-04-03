import React, {useRef, useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import MoneyIcon from '@material-ui/icons/Money';
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
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  }
}));

const TestPositive = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const posRef = useRef(null);
  const rateRef = useRef(null);
  
  const switchURL = () => {
    if ( props.state == '' ) {
      return json("https://covidtracking.com/api/us/daily")
    } else {
      return json(`https://covidtracking.com/api/states/daily?state=${props.state}`)
    }
  };

 
  useEffect(()=> {

    d3.select(rateRef.current).selectAll('p').text('');
      
      switchURL().then(data=>{
          
          
          var today = data[0].positive;
          var yesterday = data[1].positive;

          var increaseRate = Math.round(((today - yesterday)/yesterday)*100) + "%";

          d3.select(posRef.current)
              .text(today)
          
          d3.select(rateRef.current)
          .append("p")
          .text(increaseRate)
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
              Test Positive
            </Typography>
            <Typography 
              variant="h3"
              ref={posRef}
              >
              </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          {/* { increaseRate > 0 ?  <ArrowUpwardIcon className={classes.differenceIcon} /> : <ArrowDownwardIcon className={classes.differenceIcon} />} */}
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

TestPositive.propTypes = {
  className: PropTypes.string
};

export default TestPositive;
