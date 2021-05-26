import React from 'react'
import {withStyles} from '@material-ui/core/styles';
import {
    Tabs,
    Tab,
    Typography, Card, Button
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Link, withRouter} from "react-router-dom";
import {colors} from '../../theme'
import paramiLogo from '../../assets/iconic_gradientbg.png';
import twitter from '../../assets/twitter.png';
import telegram from '../../assets/telegram.png';
import wechat from '../../assets/wechat.png';
import github from '../../assets/github.png';
import "./headerNew.scss";
import i18n from '../../i18n';
import {GET_BALANCES_RETURNED} from "../../constants";
import Store from "../../stores";

const styles = theme => ({
    root: {
        verticalAlign: 'top',
        width: '100%',
        display: 'flex',
    },
    stake: {
        flex: '1',
        height: '75px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: colors.pink,
        '&:hover': {
            backgroundColor: "#f9fafb",
            '& .title': {
                color: colors.pink
            },
            '& .titleActive': {
                color: colors.pink,
                borderBottom: '4px solid ' + colors.pink,
                padding: '10px 0px'
            },
            '& .icon': {
                color: colors.pink
            }
        },
        '& .title': {
            color: colors.white
        },
        '& .titleActive': {
            color: colors.white,
            borderBottom: '4px solid white',
            padding: '10px 0px'
        },
        '& .icon': {
            color: colors.white
        },
    },
    vote: {
        flex: '1',
        height: '75px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: colors.lightBlue,
        '&:hover': {
            backgroundColor: "#f9fafb",
            '& .title': {
                color: colors.lightBlue,
            },
            '& .titleActive': {
                color: colors.lightBlue,
                borderBottom: '4px solid ' + colors.lightBlue,
                padding: '10px 0px'
            },
            '& .icon': {
                color: colors.lightBlue
            }
        },
        '& .title': {
            color: colors.white
        },
        '& .titleActive': {
            color: colors.white,
            borderBottom: '4px solid white',
            padding: '10px 0px'
        },
        '& .icon': {
            color: colors.white
        },
    },
    lock: {
        flex: '1',
        height: '75px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: colors.tomato,
        '&:hover': {
            backgroundColor: "#f9fafb",
            '& .title': {
                color: colors.tomato
            },
            '& .titleActive': {
                color: colors.tomato,
                borderBottom: '4px solid ' + colors.tomato,
                padding: '10px 0px'
            },
            '& .icon': {
                color: colors.tomato
            }
        },
        '& .title': {
            color: colors.white
        },
        '& .titleActive': {
            color: colors.white,
            borderBottom: '4px solid white',
            padding: '10px 0px'
        },
        '& .icon': {
            color: colors.white
        }
    },
});

class HeaderNew extends Component {

    constructor(props) {
        super()

        const rewardPools = store.getStore('rewardPools')

        this.state = {
            rewardPools: rewardPools,
            languages: store.getStore('languages'),
            language: this.switchLanguage(),
            open: true,
            anchorEl: null
        }
    }

    switchLanguage = () => {
        switch(i18n.language) {
            case 'zh':
            case 'zh-CN':
                return '中文'
            case 'en':
                return 'English'
            case 'ja':
                return '日本語'
            case 'th':
                return 'ไทย'
            default:
                return 'English'
        }
    }

    closeAlert = () => {
        this.setState({open: false})
    }

    setAnchorEl = anchorEl => [
        this.setState({ anchorEl })
    ]

    handleClick = (event) => {
        this.setAnchorEl(event.currentTarget);
    };

    handleClose = (language) => {
        let self = this
        i18n.changeLanguage(language).then(() => {
            self.setState({ language: self.switchLanguage(language)})
            self.setAnchorEl(null)
        })
    };

    navigateStake = (rewardPool) => {
        store.setStore({currentPool: rewardPool})
        if(rewardPool.id === 'BalanceKani'){
            props.history.push('/liquidity')
        }else{
            props.history.push('/stake')
        }
    }

    render() {
        const { classes, t, location } = this.props;
        const { open, anchorEl, language } = this.state

        const store = Store.store

        const account = store.getStore('account')
        const rewardPools = store.getStore('rewardPools')
        const rewardPool = rewardPools.filter((items) => items.id === 'GovernanceV2 defi')[0]
        const rewardPoolUSDT = rewardPools.filter((items) => items.id === 'GovernanceV2USDT')[0]
        const rewardPoolDAI = rewardPools.filter((items) => items.id === 'GovernanceV2Dai')[0]
        const rewardPoolKANI = rewardPools.filter((items) => items.id === 'GovernanceV2Kani')[0]
        const balancePoolKANI = rewardPools.filter((items) => items.id === 'BalanceKani')[0]

        return (
            <div className={classes.root} id="headerRoot">
                <div className="container">
                    <div className="left">
                        <div className="itemList">
                            <div className="item">
                                <Link to={"/"} className="link">
                                    <div className="img-container">
                                        <div className="logo-image">
                                            <img src={paramiLogo} alt=""/>
                                        </div>
                                        <Typography className="logo-txt">PARAMI</Typography>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="itemList">
                            <div className="item">
                                <FormControl>
                                    <Select
                                        value={age}
                                        onChange={handleChangeAge}
                                        displayEmpty
                                        inputProps={{'aria-label': 'Without label'}}
                                    >
                                        <MenuItem value="" style={{color: '#000'}}>
                                            中文
                                        </MenuItem>
                                        {/*<MenuItem style={{color: '#000'}} value={20}>English</MenuItem>*/}
                                    </Select>
                                </FormControl>
                            </div>
                            {account.address &&
                            <div className="pool-txt">
                                <a
                                    className="pool-txt-btn"
                                    onClick={() => {
                                        if (rewardPool.tokens.length > 0) {
                                            this.navigateStake(rewardPool)
                                        }
                                    }}
                                >Initial
                                </a>
                            </div>
                            }
                            {account.address &&
                            <div className="pool-txt">
                                <a
                                    className="pool-txt-btn"
                                    onClick={() => {
                                        if (rewardPoolDAI.tokens.length > 0) {
                                            this.navigateStake(rewardPoolDAI)
                                        }
                                    }}
                                >Stable
                                </a>
                            </div>
                            }
                            {account.address &&
                            <div className="pool-txt">
                                <a
                                    className="pool-txt-btn"
                                    onClick={() => {
                                        if (rewardPoolUSDT.tokens.length > 0) {
                                            this.navigateStake(rewardPoolKANI)
                                        }
                                    }}
                                >Govern
                                </a>
                            </div>
                            }
                            {account.address &&
                            <div className="pool-txt">
                                <a
                                    className="pool-txt-btn"
                                    onClick={() => {
                                        if (balancePoolKANI.tokens.length > 0) {
                                            this.navigateStake(balancePoolKANI)
                                        }
                                    }}
                                >Liquidity
                                </a>
                            </div>
                            }
                            <div className="item">
                                <a href={'https://twitter.com/ParamiProtocol'} target="_blank">Twitter</a>
                            </div>
                            <div className="item">
                                <a href={'https://github.com/parami-protocol/defi-pool'} target="_blank">Github</a>
                            </div>
                            <div className="item">
                                <a href={'https://t.me/ParamiProtocolEN'} target="_blank">Telegram</a>
                            </div>
                            <div className="item">
                                <a href={'https://github.com/parami-protocol/defi-pool'} target="_blank">FAQ</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withNamespaces()(withRouter(withStyles(styles)(HeaderNew)));
