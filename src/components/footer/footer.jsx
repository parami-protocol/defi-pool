import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import {
  Link
} from "react-router-dom";
// import { withNamespaces } from 'react-i18next';
// import i18n from '../../i18n';
import { colors } from '../../theme'
import './footer.scss'

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
  footer: {
    padding: '24px',
    display: 'flex',
    // flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    }
  },
  footerLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '420px'
  },
  footerText: {
    cursor: 'pointer'
  },
  languageContainer: {
    paddingLeft: '12px',
    display: 'none'
  },
  selectInput: {
    fontSize: '14px',
    color: colors.pink
  },
  link: {
    textDecoration: 'none'
  }
});


class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      languages: store.getStore('languages'),
      language: 'en',
    }
  }

  render() {
    const { classes, t, location } = this.props;
    const {
    } = this.state

    return (
        <div className='footer' id='footerRoot'>
          <div  className='link' onClick={()=> window.open("https://twitter.com/ParamiProtocol", "_blank")} >
            <img alt="" src={ require('../../assets/twitter.png') } height='24px' className='icon' />
            <Typography className='linkTxt' variant={ 'h4'} >Twitter</Typography>
          </div>
          <div  className='link' onClick={()=> window.open("https://github.com/parami-protocol/defi-pool", "_blank")} >
            <img alt="" src={ require('../../assets/github.png') } height='24px' className='icon' />
            <Typography className='linkTxt' variant={ 'h4'} >Github</Typography>
          </div>
          <div  className='link' onClick={()=> window.open("https://t.me/ParamiProtocolEN", "_blank")} >
            <img alt="" src={ require('../../assets/telegram.png') } height='24px' className='icon' />
            <Typography className='linkTxt' variant={ 'h4'} >Telegram</Typography>
          </div>
        </div>
    )
  }
}

export default (withRouter(withStyles(styles)(Footer)));
