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
import "./header.scss";
import i18n from '../../i18n';
import {GET_BALANCES_RETURNED} from "../../constants";
import Store from "../../stores";
import { useTranslation } from 'react-i18next';


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

function Header(props)  {

    const {
        classes,
        setHeaderValue,
        headerValue,
        location,
        state={
            age:10
        }
    } = props;

    const store = Store.store

    const { t, i18n } = useTranslation();


    const account = store.getStore('account')
    const rewardPools = store.getStore('rewardPools')
    const rewardPool = rewardPools.filter((items) => items.id === 'GovernanceV2 defi')[0]
    const rewardPoolUSDT = rewardPools.filter((items) => items.id === 'GovernanceV2USDT')[0]
    const rewardPoolDAI = rewardPools.filter((items) => items.id === 'GovernanceV2Dai')[0]
    const rewardPoolKANI = rewardPools.filter((items) => items.id === 'GovernanceV2Kani')[0]
    const balancePoolKANI = rewardPools.filter((items) => items.id === 'BalanceKani')[0]


    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    //     setHeaderValue(newValue)
    // };

    const nav = (screen) => {
        props.history.push('/' + screen)
    }

    const  currentType = 0
    const [type, setType] = React.useState('44444');

    const navigateStake = (rewardPool,type) => {
        // alert(setType('ddddd3333'))
        setType(type)
        store.setStore({currentPool: rewardPool})
        if(rewardPool.id === 'BalanceKani'){
            props.history.push('/liquidity')
        }else{
            props.history.push('/stake')
        }
    }
    let currentLang='cn'

    if(i18n.language=='zh_CN')
    {
        currentLang='cn'
    }else if(i18n.language=='en_US')
    {
        currentLang='en'
    }else{
        currentLang='ja'
    }
    const [lang, setLang] = React.useState(currentLang);

    const handleChangeLang = (event) => {
        setLang(event.target.value);
        var l=event.target.value;
        if(l=='cn')
        {
            i18n.changeLanguage('zh_CN')
        }else if(l=='ja')
        {
            i18n.changeLanguage('zh_TW')
        }else{
            i18n.changeLanguage('en_US')
        }
    };

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
                                    <Typography className="logo-txt">AD3</Typography>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="itemList">
                        {account.address &&
                        <div className="pool-txt">
                            <a
                            className={(type === 1)?'pool-txt-btn-active':'pool-txt-btn'}
                            onClick={() => {
                                    if (rewardPool.tokens.length > 0) {
                                        navigateStake(rewardPool,1)
                                    }
                                }}
                            >{t('Header.Initial')}
                            </a>
                        </div>
                        }
                        {account.address &&
                        <div className="pool-txt">
                            <a
                                className={(type === 2)?'pool-txt-btn-active':'pool-txt-btn'}
                                onClick={() => {
                                    if (rewardPoolDAI.tokens.length > 0) {
                                        navigateStake(rewardPoolDAI,2)
                                    }
                                }}
                            >{t('Header.Stable')}
                            </a>
                        </div>
                        }
                        {account.address &&
                        <div className="pool-txt">
                            <a
                                className={(type === 3)?'pool-txt-btn-active':'pool-txt-btn'}
                                onClick={() => {
                                    if (rewardPoolUSDT.tokens.length > 0) {
                                        navigateStake(rewardPoolKANI,3)
                                    }
                                }}
                            >{t('Header.Govern')}
                            </a>
                        </div>
                        }
                        {account.address &&
                        <div className="pool-txt">
                            <a
                                className={(type === 4)?'pool-txt-btn-active':'pool-txt-btn'}
                                onClick={() => {
                                    if (balancePoolKANI.tokens.length > 0) {
                                        navigateStake(balancePoolKANI,4)
                                    }
                                }}
                            >{t('Header.Liquidity')}
                            </a>
                        </div>
                        }
                        <div className="pool-txt">
                        <a className='pool-txt-btn' href={'https://github.com/parami-protocol/defi-pool'} target="_blank">FAQ</a>
                        </div>
                        <div className="item">
                            <FormControl>
                                <Select
                                    className="select-container"
                                    inputProps={{'aria-label': 'Without label'}}
                                    value={lang}
                                    defaultValue={'en'}
                                    onChange={handleChangeLang}
                                >
                                    <MenuItem value={'en'} style={{color: '#000'}}>English</MenuItem>
                                    <MenuItem value={'cn'} style={{color: '#000'}}>中文</MenuItem>
                                    <MenuItem value={'ja'} style={{color: '#000'}}>日本語</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {/*<div className="item">*/}
                        {/*<a>WeChat</a>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(withStyles(styles)(Header));
