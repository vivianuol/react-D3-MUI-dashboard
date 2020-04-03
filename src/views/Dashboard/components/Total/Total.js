
import React, { useRef, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import * as d3 from 'd3';
import { json } from 'd3-fetch';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.white,
    color: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  }
}));

const Total = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const totalRef = useRef(null);
  const rateRef = useRef(null);

  const switchURL = () => {
    if ( props.state == '' ) {
      return json("https://covidtracking.com/api/us/daily")
    } else {
      return json(`https://covidtracking.com/api/states/daily?state=${props.state}`)
    }
  };

  useEffect(() => {
    
    d3.select(rateRef.current).selectAll('p').text('');

    switchURL().then(data=> {
      var today = data[0].total;
      var yesterday = data[1].total;

      var increaseRate = Math.round(((today - yesterday)/yesterday)*100) + "%";

      d3.select(totalRef.current)
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
              color="inherit"
              gutterBottom
              variant="body2"
            >
              TOTAL TESTED
            </Typography>
            <Typography
              color="inherit"
              variant="h3"
              ref= {totalRef}
            >
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
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

Total.propTypes = {
  className: PropTypes.string
};

export default Total;
