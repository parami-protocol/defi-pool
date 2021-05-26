import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {
    Card,
    Button,
    Typography,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {colors} from '../../theme'
import Store from "../../stores";
import './home.scss'
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import DetailsIcon from '@material-ui/icons/Details';
import LockIcon from '@material-ui/icons/Lock';
import {CONFIGURE_RETURNED, GET_BALANCES, GET_BALANCES_RETURNED, GOVERNANCE_CONTRACT_CHANGED} from "../../constants";

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
        }
    },
    card: {
        flex: '1',
        height: '25vh',
        width: '100%',
        display: 'flex',
        backgroundColor: 'transparent',
        color: '#ffffff',
        marginLeft: '160%',
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: '0px',
        transition: 'background-color 0.2s linear',
        [theme.breakpoints.up('sm')]: {
            height: '100vh',
            minWidth: '20%',
            minHeight: '50vh',
        }
    },
    stake: {
        backgroundColor: colors.white,
        '&:hover': {
            backgroundColor: colors.pink,
            '& .title': {
                color: colors.white
            },
            '& .icon': {
                color: colors.white
            }
        },
        '& .title': {
            color: colors.pink
        },
        '& .icon': {
            color: colors.pink
        }
    },
    vote: {
        backgroundColor: colors.white,
        '&:hover': {
            backgroundColor: colors.blue,
            '& .title': {
                color: colors.white,
            },
            '& .icon': {
                color: colors.white
            }
        },
        '& .title': {
            color: colors.blue,
            display: 'block'
        },
        '& .soon': {
            color: colors.blue,
            display: 'none'
        },
        '& .icon': {
            color: colors.blue
        },
    },
    lock: {
        backgroundColor: colors.white,
        '&:hover': {
            backgroundColor: colors.tomato,
            '& .title': {
                color: colors.white,
            },
            '& .icon': {
                color: colors.white
            }
        },
        '& .title': {
            color: colors.tomato,
        },
        '& .icon': {
            color: colors.tomato
        },
    },
    title: {
        padding: '24px',
        paddingBottom: '0px',
        [theme.breakpoints.up('sm')]: {
            paddingBottom: '24px'
        }
    },
    icon: {
        fontSize: '60px',
        [theme.breakpoints.up('sm')]: {
            fontSize: '100px',
        }
    },
    link: {
        textDecoration: 'none'
    }
});

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Home extends Component {

    constructor(props) {
        super()

        const account = store.getStore('account')
        const rewardPools = store.getStore('rewardPools')

        this.state = {
            rewardPools: rewardPools,
            account: account,
        }

        dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }

    componentWillMount() {
        emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
    }

    componentWillUnmount() {
        emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
    };

    balancesReturned = () => {
        const rewardPools = store.getStore('rewardPools')
        this.setState({ rewardPools: rewardPools })
    }

    render() {
        const {classes, t, location} = this.props;
        const rewardPools = store.getStore('rewardPools')
        const rewardPool = rewardPools.filter((items) => items.id === 'GovernanceV2 defi')[0]

        return (
            <div className='home-root'>
                <Card className='card'>
                    <Typography className='home-middle-txt'>AD3</Typography>
                    <Typography className='home-middle-txt'>parami-finance</Typography>
                    {/*<Button*/}
                        {/*className='open-btn'*/}
                        {/*onClick={ () => { if(rewardPool.tokens.length > 0) { this.navigateStake(rewardPool) } } }*/}
                    {/*>*/}
                        {/*<Typography>initial liquidity</Typography>*/}
                    {/*</Button>*/}
                </Card>
                {/*<Card className={ `${classes.card} ${classes.vote}` } onClick={ () => { this.nav(location.pathname+'vote') } }>*/}
                {/*<HowToVoteIcon className={ `${classes.icon} icon` } />*/}
                {/*<Typography variant={'h3'} className={ `${classes.title} title` }>Vote</Typography>*/}
                {/*</Card>*/}
                {/*<Card className={ `${classes.card} ${classes.lock}` } onClick={ () => { this.nav(location.pathname+'lock') }}>
          <LockIcon className={ `${classes.icon} icon` } />
          <Typography variant={'h3'} className={ `${classes.title} title` }>Lock</Typography>
        </Card>*/}
            </div>
        )
    };

    navigateStake = (rewardPool) => {
        store.setStore({currentPool: rewardPool})
        this.props.history.push('/stake')
    }

    nav = (screen) => {
        this.props.history.push(screen)
    }
}

export default withRouter(withStyles(styles)(Home));
