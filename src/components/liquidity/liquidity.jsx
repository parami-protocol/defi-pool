import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {
    Typography,
    Button,
    Card,
    TextField,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    InputAdornment
} from '@material-ui/core';
// import ToggleButton from '@material-ui/lab/ToggleButton';
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import { withTranslation } from 'react-i18next';

// import CheckIcon from '@material-ui/icons/Check';
// import ClearIcon from '@material-ui/icons/Clear';

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import {colors} from '../../theme'
import "./liquidity.scss"

import {
    GET_LIQUIDITY_BALANCES,
    ERROR,
    // CONFIGURE_RETURNED,
    STAKE,
    STAKE_RETURNED,
    WITHDRAW,
    WITHDRAW_RETURNED,
    GET_REWARDS,
    GET_REWARDS_RETURNED,
    EXIT,
    EXIT_RETURNED,
    // GET_YCRV_REQUIREMENTS,
    GET_YCRV_REQUIREMENTS_RETURNED,
    // GET_GOVERNANCE_REQUIREMENTS,
    GET_GOVERNANCE_REQUIREMENTS_RETURNED,
    GET_BALANCES_RETURNED,
    // GET_BALANCES,
    GETROI,
    // CONFIGURE,
    GETUNIKANIROI
} from '../../constants'
// import FormControl from "../header";

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '120px'
    },
    intro: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    introCenter: {
        minWidth: '100%',
        textAlign: 'center',
        padding: '48px 0px'
    },
    investedContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        minWidth: '100%',
        [theme.breakpoints.up('md')]: {
            minWidth: '800px',
        }
    },
    connectContainer: {
        padding: '12px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '450px',
        [theme.breakpoints.up('md')]: {
            width: '450',
        }
    },
    disaclaimer: {
        padding: '12px',
        border: '1px solid rgb(174, 174, 174)',
        borderRadius: '0.75rem',
        marginBottom: '24px',
    },
    addressContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'hidden',
        flex: 1,
        whiteSpace: 'nowrap',
        fontSize: '0.83rem',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
        padding: '28px 30px',
        borderRadius: '50px',
        border: '1px solid ' + colors.borderBlue,
        alignItems: 'center',
        maxWidth: '500px',
        [theme.breakpoints.up('md')]: {
            width: '100%'
        }
    },
    walletAddress: {
        padding: '0px 12px'
    },
    walletTitle: {
        flex: 1,
        color: '#ffffff'
    },
    overviewField: {
        display: 'flex',
        flexDirection: 'column'
    },
    overviewTitle: {
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '400'
    },
    overviewValue: {
        marginTop: '8px',
        fontSize: '22px',
        fontWeight: '400'
    },
    actions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '900px',
        flexWrap: 'wrap',
        background: colors.white,
        border: '1px solid ' + colors.borderBlue,
        padding: '28px 30px',
        borderRadius: '50px',
        marginTop: '40px'
    },
    actionContainer: {
        minWidth: 'calc(50% - 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px'
    },
    primaryButton: {
        '&:hover': {
            backgroundColor: "#2F80ED",
        },
        padding: '20px 32px',
        backgroundColor: "#2F80ED",
        borderRadius: '50px',
        fontWeight: 500,
    },
    actionButton: {
        padding: '20px 32px',
        borderRadius: '50px',
    },
    buttonText: {
        fontWeight: '700',
    },
    stakeButtonText: {
        fontWeight: '700',
        color: 'white',
    },
    valContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    actionInput: {
        padding: '12px 5px',
        fontSize: '0.5rem',
        border: '2px solid #ffffff',
        borderRadius: '20px',
        color: '#ffffff'
    },
    inputAdornment: {
        fontWeight: '600',
        fontSize: '1.5rem',
        color: '#ffffff'
    },
    assetIcon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '25px',
        background: '#dedede',
        height: '30px',
        width: '30px',
        textAlign: 'center',
        marginRight: '16px'
    },
    balances: {
        width: '100%',
        textAlign: 'right',
        paddingRight: '20px',
        cursor: 'pointer'
    },
    stakeTitle: {
        width: '100%',
        color: '#ffffff',
        marginBottom: '20px'
    },
    stakeButtons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        align: 'center',
        marginTop: '20px'
    },
    stakeButton: {
        minWidth: '300px'
    },
    requirement: {
        display: 'flex',
        alignItems: 'center'
    },
    check: {
        paddingTop: '6px'
    },
    voteLockMessage: {
        margin: '20px'
    },
    title: {
        width: '100%',
        color: colors.darkGray,
        minWidth: '100%',
        marginLeft: '20px'
    },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Liquidity extends Component {

    constructor(props) {
        super()
        // store.subscribe(() => {
        //     console.log('state状态改变了，新状态如下')
        //     console.log(store.getState())
        // })

        const account = store.getStore('account')
        const roi = store.getStore('roi')
        // const pool = store.getStore('currentPool')
        const governanceContractVersion = store.getStore('governanceContractVersion')

        // if (!pool) {
        //     props.history.push('/')
        // }

        this.state = {
            assets: store.getStore('liquidityPools'),
            roi: roi,
            loading: !(account),
            account: account,
            value: 'options',
            voteLockValid: false,
            balanceValid: false,
            voteLock: null,
            governanceContractVersion: governanceContractVersion
        }

        if(account && account.address) {
            dispatcher.dispatch({ type: GET_LIQUIDITY_BALANCES, content: {} })
        }
    }
    // componentWillReceiveProps (nextProps, nextState) {
    //     if (this.props.location.pathname === '/stake'){
    //         this.setState({pool: store.getStore('currentPool')})
    //         dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    //     }
    // }

    componentWillMount() {
        emitter.on(ERROR, this.errorReturned);
        emitter.on(STAKE_RETURNED, this.showHash);
        emitter.on(WITHDRAW_RETURNED, this.showHash);
        emitter.on(EXIT_RETURNED, this.showHash);
        emitter.on(GET_REWARDS_RETURNED, this.showHash);
        emitter.on(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
        emitter.on(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
        emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
        dispatcher.dispatch({ type: GETROI, content: {} })
        dispatcher.dispatch({ type: GETUNIKANIROI, content: {} })

    }

    componentWillUnmount() {
        emitter.removeListener(ERROR, this.errorReturned);
        emitter.removeListener(STAKE_RETURNED, this.showHash);
        emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
        emitter.removeListener(EXIT_RETURNED, this.showHash);
        emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
        emitter.removeListener(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
        emitter.removeListener(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
        emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
    };

    refresh() {
        dispatcher.dispatch({ type: GET_LIQUIDITY_BALANCES, content: {} })
    }

    balancesReturned = (balances) => {
        this.setState({ assets: store.getStore('liquidityPools') })
        // setTimeout(this.refresh, 300000);
    };

    yCrvRequirementsReturned = (requirements) => {
        this.setState({
            balanceValid: requirements.balanceValid,
            voteLockValid: requirements.voteLockValid,
            voteLock: requirements.voteLock
        })
    }

    govRequirementsReturned = (requirements) => {
        this.setState({
            gov_voteLockValid: requirements.voteLockValid,
            gov_voteLock: requirements.voteLock
        })
    }

    showHash = (txHash) => {
        this.setState({snackbarMessage: null, snackbarType: null, loading: false})
        const that = this
        setTimeout(() => {
            const snackbarObj = {snackbarMessage: txHash, snackbarType: 'Hash'}
            that.setState(snackbarObj)
        })
    };

    errorReturned = (error) => {
        const snackbarObj = {snackbarMessage: null, snackbarType: null}
        this.setState(snackbarObj)
        this.setState({loading: false})
        const that = this
        setTimeout(() => {
            const snackbarObj = {snackbarMessage: error.toString(), snackbarType: 'Error'}
            that.setState(snackbarObj)
        })
    };

    render() {
        const {classes} = this.props;
        const {
            value,
            account,
            modalOpen,
            pool,
            loading,
            snackbarMessage,
            voteLockValid,
            balanceValid,
            gov_voteLock,
            gov_voteLockValid
        } = this.state

        var address = null;
        if (account.address) {
            address = account.address.substring(0, 6) + '...' + account.address.substring(account.address.length - 4, account.address.length)
        }

        // if (!pool) {
        //     return null
        // }

        return (
            <div className={classes.root} id="balanceRoot">
                <Typography variant={'h5'} className={classes.disaclaimer + ' ea_header_tit'}>This project is in beta.
                    Use at your own risk.</Typography>
                <div className={classes.intro}>
                    {/*<Button*/}
                    {/*className={ classes.stakeButton }*/}
                    {/*variant="outlined"*/}
                    {/*color="secondary"*/}
                    {/*disabled={ loading }*/}
                    {/*onClick={ () => {  this.props.history.push('/staking') } }*/}
                    {/*>*/}
                    {/*<Typography variant={ 'h4'}>Back 返回</Typography>*/}
                    {/*</Button>*/}
                    <Card className='addressContainer' onClick={this.overlayClicked}>
                        <Typography variant={'h3'} className={classes.walletTitle} noWrap>Wallet</Typography>
                        <Typography variant={'h4'} className={classes.walletAddress} noWrap>{address}</Typography>
                        <div style={{
                            background: '#6FED9B',
                            opacity: '1',
                            borderRadius: '10px',
                            width: '10px',
                            height: '10px',
                            marginRight: '3px',
                            marginTop: '3px',
                            marginLeft: '6px'
                        }}></div>
                    </Card>
                </div>
                { account.address && this.renderAsset() }
                {snackbarMessage && this.renderSnackbar()}
                {loading && <Loader/>}
            </div>
        )
    }

    renderAsset = () => {
        const {  assets, expanded, value } = this.state
        const { classes, t } = this.props

        var roi
        if(roi !== ''){
            roi = store.getStore('roi')
        }

        var uniroi
        if(uniroi !== ''){
            uniroi = store.getStore('uniroi')
        }

        return assets.map((asset) => {
            return (
                <Accordion  className="balance-container" key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <div className="balance">
                            <div className="left">
                                <div className="roi-container">
                                    <Typography variant={'h3'} className={classes.overviewTitle + ' balanceName'}>{`${asset.pairSymbol}/AD3`}</Typography>
                                    <Typography variant={'h6'} className="roi">回报率：</Typography>
                                    {asset.id === 'BalanceKani' &&  <div className="roi">{roi || '计算中'}</div>}
                                    {asset.id === 'UniswapKani' &&  <div className="roi">{uniroi || '计算中'}</div>}
                                </div>
                                <div className="linkbtn-container">
                                    <a className="linkbalance" href={asset.linkLiqui} target="_blank">添加流动性</a>
                                    <a className="linkbalance" href={asset.linkTrade} target="_blank">交易</a>
                                </div>
                            </div>
                            <div className="right">
                                <div className="container-overview">
                                    <Typography variant={'h3'} className={classes.overviewTitle}>余额</Typography>
                                    <Typography variant={'h2'}
                                                className={classes.overviewValue}>{asset.tokens[0].balance ? asset.tokens[0].balance.toFixed(4) : "0"}
                                        <i className='symbol_name'>{asset.tokens[0].symbol}</i></Typography>
                                </div>
                                <div className="container-overview">
                                    <Typography variant={'h3'} className={classes.overviewTitle}>抵押</Typography>
                                    <Typography variant={'h2'}
                                                className={classes.overviewValue}>{asset.tokens[0].stakedBalance ? asset.tokens[0].stakedBalance.toFixed(4) : "0"}</Typography>
                                </div>
                                <div className="container-overview">
                                    <Typography variant={'h3'} className={classes.overviewTitle}>奖励</Typography>
                                    <Typography variant={'h2'} className={classes.overviewValue}>
                                        {asset.tokens[0].rewardsAvailable ? asset.tokens[0].rewardsAvailable.toFixed(2) : "0"}<i className='symbol_name'> {asset.tokens[0].rewardsSymbol != '$' ? asset.tokens[0].rewardsSymbol : ''}</i>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        {value === 'options' && this.renderOptions(asset)}
                        {value === 'stake' && this.renderStake(asset)}
                        {/*{value === 'claim' && this.renderClaim(asset)}*/}
                        {value === 'unstake' && this.renderUnstake(asset)}
                        {/*{value === 'exit' && this.renderExit(asset)}*/}
                    </AccordionDetails>
                </Accordion>
            )
        })
    }

    renderOptions = (asset) => {
        const {classes} = this.props;
        const {
            loading,
            voteLockValid,
            balanceValid,
            voteLock,
            gov_voteLockValid,
            gov_voteLock,
        } = this.state

        return (
            <div className={classes.actions + ' ea_button_box'}>
                {/*<Typography variant={'h3'} className={classes.title + ' ea_button_top'} noWrap>{pool.name}</Typography>*/}
                <div className='btn_flex'>
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        <Button
                            fullWidth
                            className={classes.primaryButton}
                            variant="outlined"
                            color="primary"
                            disabled={!asset.depositsEnabled || (['FeeRewards'].includes(asset.id) ? (loading || !voteLockValid || !balanceValid) : loading)}
                            onClick={() => {
                                this.navigateInternal('stake')
                            }}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>抵押</Typography>
                        </Button>
                    </div>
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        <Button
                            fullWidth
                            className={classes.actionButton}
                            variant="outlined"
                            color="primary"
                            disabled={loading || (['GovernanceV2'].includes(asset.id) && !gov_voteLockValid)}
                            onClick={() => {
                                this.onClaim(asset)
                            }}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>领取</Typography>
                        </Button>
                    </div>
                </div>
                <div className="btn2-flex">
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        {!['GovernanceV2 defi'].includes(asset.id) &&
                        <Button
                            fullWidth
                            className={classes.actionButton}
                            variant="outlined"
                            color="primary"
                            disabled={loading || (['GovernanceV2'].includes(asset.id) && gov_voteLockValid) || (asset.id === 'Governance' && (voteLockValid))}
                            onClick={() => {
                                this.navigateInternal('unstake')
                            }}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>取消抵押</Typography>
                        </Button>
                        }
                    </div>
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        {!['GovernanceV2 defi','GovernanceV2Kani'].includes(asset.id) &&
                        <Button
                            fullWidth
                            className={classes.actionButton}
                            variant="outlined"
                            color="primary"
                            disabled={(asset.id === 'Governance' ? (loading || voteLockValid) : loading)}
                            onClick={() => {this.onExit(asset)}}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>退出并提取</Typography>
                        </Button>
                        }
                    </div>
                </div>
            </div>
        )
    }

    handleChange = (id) => {
        this.setState({ expanded: this.state.expanded === id ? null : id })
        dispatcher.dispatch({ type: GET_LIQUIDITY_BALANCES, content: {} })
    }

    navigateInternal = (val) => {
        // console.log('come stake', val)
        this.setState({value: val})
    }

    renderStake = (assetSelect) => {
        const {classes} = this.props;
        const {loading} = this.state
        const pool = assetSelect

        const asset = assetSelect.tokens[0]
        // console.log('asset', asset)

        return (
            <div className={classes.actions + ' ea_button_box'}>
                <Typography className={classes.stakeTitle} variant={'h3'}><span className='left'>抵押您的代币</span>
                    <span className="right"></span>
                </Typography>
                {this.renderAssetInput(asset, 'stake')}
                <div className={classes.stakeButtons + ' confirm_btn_box'}>
                    <Button
                        className={classes.stakeButton + ' confirm_btn_item'}
                        variant="outlined"
                        color="secondary"
                        disabled={loading}
                        onClick={() => {
                            this.navigateInternal('options')
                        }}
                    >
                        <Typography variant={'h4'}>返回</Typography>
                    </Button>
                    <Button
                        className={classes.stakeButton + ' confirm_btn_item'}
                        variant="outlined"
                        color="secondary"
                        disabled={loading}
                        onClick={() => {
                            this.onStake(pool)
                        }}
                    >
                        <Typography variant={'h4'}>抵押</Typography>
                    </Button>
                </div>

            </div>
        )
    }

    renderUnstake = (assetSelect) => {
        const {classes} = this.props;
        const {loading, voteLockValid} = this.state
        const pool = assetSelect

        const asset = assetSelect.tokens[0]

        return (
            <div className={classes.actions + ' ea_button_box'}>
                <Typography className={classes.stakeTitle} variant={'h3'}><span className='left'>将您的代币取消抵押</span>
                    <span className="right"></span>
                </Typography>
                {this.renderAssetInput(asset, 'unstake')}
                <div className={classes.stakeButtons + ' confirm_btn_box'}>
                    <Button
                        className={classes.stakeButton + ' confirm_btn_item'}
                        variant="outlined"
                        color="secondary"
                        disabled={loading}
                        onClick={() => {
                            this.navigateInternal('options')
                        }}
                    >
                        <Typography variant={'h4'}>返回</Typography>
                    </Button>
                    <Button
                        className={classes.stakeButton + ' confirm_btn_item'}
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                            this.onUnstake(pool)
                        }}
                    >
                        <Typography variant={'h4'}>取消抵押</Typography>
                    </Button>
                </div>

            </div>
        )
    }

    overlayClicked = () => {
        this.setState({modalOpen: true})
    }

    closeModal = () => {
        this.setState({modalOpen: false})
    }

    onStake = (asset) => {

        this.setState({amountError: false})
        // const {asset} = this.props
        const tokens = asset.tokens
        const selectedToken = tokens[0]
        const amount = this.state[selectedToken.id + '_stake']

        // console.log('come stake', pool)
        // console.log('come tokens', tokens)
        // console.log('come amount', amount)
        // if(amount > selectedToken.balance) {
        //   return false
        // }

        this.setState({loading: true})
        dispatcher.dispatch({type: STAKE, content: {asset: selectedToken, amount: amount}})
    }

    onClaim = (asset) => {
        // const {asset} = this.props
        const tokens = asset.tokens
        const selectedToken = tokens[0]

        this.setState({loading: true})
        dispatcher.dispatch({type: GET_REWARDS, content: {asset: selectedToken}})
    }

    onUnstake = (asset) => {
        this.setState({amountError: false})
        // const {asset} = this.props
        const tokens = asset.tokens
        const selectedToken = tokens[0]
        const amount = this.state[selectedToken.id + '_unstake']
        //
        // if(amount > selectedToken.balance) {
        //   return false
        // }

        this.setState({loading: true})
        dispatcher.dispatch({type: WITHDRAW, content: {asset: selectedToken, amount: amount}})
    }

    onExit = (asset) => {
        // const {asset} = this.props
        const tokens = asset.tokens
        const selectedToken = tokens[0]

        this.setState({loading: true})
        dispatcher.dispatch({type: EXIT, content: {asset: selectedToken}})
    }

    renderAssetInput = (asset, type) => {
        const {
            classes
        } = this.props

        const {
            loading
        } = this.state

        const amount = this.state[asset.id + '_' + type]
        const amountError = this.state[asset.id + '_' + type + '_error']
        const {pool} =asset
        const rewardPools = store.getStore('rewardPools')
        const rewardPoolUSDT = rewardPools.filter((items) => items.id === 'GovernanceV2USDT')[0]
        const rewardPoolDAI = rewardPools.filter((items) => items.id === 'GovernanceV2Dai')[0]


        return (
            <div className={classes.valContainer + ' ea_val_container'} key={asset.id + '_' + type}>
                <div className={classes.balances + ' ea_val_balance'}>
                    {type === 'stake' && <Typography variant='h4' onClick={() => {
                        this.setAmount(asset.id, type, (asset ? asset.balance : 0))
                    }} className={classes.value}
                                                     noWrap>{'余额: ' + (asset && asset.balance ? (Math.floor(asset.balance * 10000) / 10000).toFixed(4) : '0.0000')} {asset ? asset.symbol : ''}</Typography>}
                    {type === 'unstake' && <Typography variant='h4' onClick={() => {
                        this.setAmount(asset.id, type, (asset ? asset.stakedBalance : 0))
                    }} className={classes.value}
                                                       noWrap>{'余额: ' + (asset && asset.stakedBalance ? (Math.floor(asset.stakedBalance * 10000) / 10000).toFixed(4) : '0.0000')} {asset ? asset.symbol : ''}</Typography>}
                </div>
                <div>
                    <TextField
                        fullWidth
                        disabled={loading}
                        className={classes.actionInput}
                        id={'' + asset.id + '_' + type}
                        value={amount}
                        error={amountError}
                        onChange={this.onChange}
                        placeholder="0.00"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" className={classes.inputAdornment}><Typography
                                variant='h3' className={''}>{asset.symbol}</Typography>
                                {/*<Select*/}
                                    {/*value={pool}*/}
                                    {/*onChange={this.navigateStake}*/}
                                    {/*displayEmpty*/}
                                    {/*// inputProps={{'aria-label': 'Without label'}}*/}
                                {/*>*/}
                                    {/*<MenuItem value={rewardPoolUSDT} style={{color: '#000'}}>USDT</MenuItem>*/}
                                    {/*<MenuItem value={rewardPoolDAI} style={{color: '#000'}}>DAI</MenuItem>*/}
                                    {/*<MenuItem style={{color: '#000'}} value={20}>English</MenuItem>*/}
                                {/*</Select>*/}
                            </InputAdornment>,
                            startAdornment: <InputAdornment position="end" className={classes.inputAdornment}>
                                <div className={classes.assetIcon}>
                                    <img
                                        alt=""
                                        src={require('../../assets/' + asset.symbol + '-logo.png')}
                                        height="30px"
                                    />
                                </div>
                            </InputAdornment>,
                        }}
                    />
                </div>
            </div>
        )
    }

    renderSnackbar = () => {
        var {
            snackbarType,
            snackbarMessage
        } = this.state
        return <Snackbar type={snackbarType} message={snackbarMessage} open={true}/>
    };

    onChange = (event) => {
        let val = []
        val[event.target.id] = event.target.value
        this.setState(val)
    }

    setAmount = (id, type, balance) => {
        const bal = (Math.floor((balance === '' ? '0' : balance) * 10000) / 10000).toFixed(4)
        let val = []
        val[id + '_' + type] = bal
        this.setState(val)
    }

}

export default withTranslation()(withRouter(withStyles(styles)(Liquidity)));
