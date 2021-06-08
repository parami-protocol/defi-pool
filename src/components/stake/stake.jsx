import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Progress from '../progress/progress'
import {
    Typography,
    Button,
    // Card,
    TextField,
    InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@material-ui/core';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';

// import CheckIcon from '@material-ui/icons/Check';
// import ClearIcon from '@material-ui/icons/Clear';

// import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import {colors} from '../../theme'
import "./stake.scss"
//import { useTranslation } from 'react-i18next';
// the hoc
import { withTranslation } from 'react-i18next';


import {
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
    GET_YCRV_REQUIREMENTS,
    GET_YCRV_REQUIREMENTS_RETURNED,
    GET_GOVERNANCE_REQUIREMENTS,
    GET_GOVERNANCE_REQUIREMENTS_RETURNED,
    GET_BALANCES_RETURNED, GET_BALANCES, GETROI, GETDAIROI, GETKANIROI
} from '../../constants'
// import FormControl from "../header";

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        // maxWidth: '900px',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '80px',
        background: 'linear-gradient(60deg, #FFDED8 0%, #E2F7F8 100%)'
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
    overview: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '28px 30px',
        borderRadius: '50px',
        border: '1px solid ' + colors.borderBlue,
        alignItems: 'center',
        marginTop: '40px',
        width: '100%',
        background: colors.white
    },
    overviewField: {
        display: 'flex',
        flexDirection: 'column'
    },
    overviewTitle: {
        color: '#ffffff'
    },
    overviewValue: {},
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


class Stake extends Component {

    constructor(props) {
        super()
        // store.subscribe(() => {
        //     console.log('state状态改变了，新状态如下')
        //     console.log(store.getState())
        // })

        const account = store.getStore('account')
        // const daiRoi = store.getStore('daiRoi')
        const pool = store.getStore('currentPool')
        const governanceContractVersion = store.getStore('governanceContractVersion')

        console.log(props)
        if (!pool) {
            props.history.push('/')
        }

        this.state = {
            pool: pool,
            loading: !(account || pool),
            account: account,
            value: 'options',
            voteLockValid: false,
            balanceValid: false,
            voteLock: null,
            governanceContractVersion: governanceContractVersion
           //,t: tr.useTranslation()
        }

        if (pool && ['FeeRewards', 'Governance'].includes(pool.id)) {
            dispatcher.dispatch({type: GET_YCRV_REQUIREMENTS, content: {}})
        }

        if (pool && ['GovernanceV2'].includes(pool.id)) {
            dispatcher.dispatch({type: GET_GOVERNANCE_REQUIREMENTS, content: {}})
        }
    }

    componentWillReceiveProps (nextProps, nextState) {
        if (this.props.location.pathname === '/stake'){
            this.setState({pool: store.getStore('currentPool')})
            dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
    }

    componentWillMount() {
        emitter.on(ERROR, this.errorReturned);
        emitter.on(STAKE_RETURNED, this.showHash);
        emitter.on(WITHDRAW_RETURNED, this.showHash);
        emitter.on(EXIT_RETURNED, this.showHash);
        emitter.on(GET_REWARDS_RETURNED, this.showHash);
        emitter.on(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
        emitter.on(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
        emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
        dispatcher.dispatch({ type: GETDAIROI, content: {} })
        dispatcher.dispatch({ type: GETKANIROI, content: {} })
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

    balancesReturned = () => {
        const currentPool = store.getStore('currentPool')
        const pools = store.getStore('rewardPools')
        let newPool = pools.filter((pool) => {
            return pool.id === currentPool.id
        })

        if (newPool.length > 0) {
            newPool = newPool[0]
            store.setStore({currentPool: newPool})
        }
    }

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
        const { t } = this.props;
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

        var daiRoi
        if(daiRoi !== ''){
            daiRoi = store.getStore('daiRoi')
        }

        var kaniRoi
        if(kaniRoi !== ''){
            kaniRoi = store.getStore('kaniRoi')
        }

        if (!pool) {
            return null
        }
        const useStyles = makeStyles({
            table: {
                minWidth: 650,
            },
        });
        
        function createData(name, calories, fat, carbs, protein, type) {
            return { name, calories, fat, carbs, protein, type };
        }
        
        const rows = [
            createData('USDT', '4.68k', '4.67k', '0.84', '101.32%', 'Deposit'),
            createData('USDC', '123.85k', '123.85k', '1', '100.34%', 'Deposit'),
            createData('ETH', '917.13k', '868.52k', '0.895', '89.5%', 'Deposit')
        ];
        this.formValue = ''

        return (

            <div className={classes.root} id="stakeRoot">
                <section className="stake-start-top">
                    <p className="stake-start-top__title">AD3</p>
                    <p className="stake-start-top__subtitle">parami-finance</p>
                </section>
                <section className="stake-start-block">
                    <ul className="stake-start-block__ul">
                        <li className="stake-start-block__li">
                            <p className="stake-start-block__title">Total supply & borrow</p>
                            <p className="stake-start-block__subtitle">$39,334,340.87</p>
                        </li>
                        <li className="stake-start-block__li">
                            <p className="stake-start-block__title">Total supply & borrow</p>
                            <p className="stake-start-block__subtitle">$39,334,340.87</p>
                        </li>
                        <li className="stake-start-block__li">
                            <p className="stake-start-block__title">Total supply & borrow</p>
                            <p className="stake-start-block__subtitle">$39,334,340.87</p>
                        </li>
                        <li className="stake-start-block__li">
                            <p className="stake-start-block__title">Total supply & borrow</p>
                            <p className="stake-start-block__subtitle">$39,334,340.87</p>
                        </li>
                    </ul>
                </section>
                <section className="stake-start-table">
                    <div className="stake-start-table-top">
                        <span className="stake-start-table__title">Overview</span>
                        <form className={classes.root, 'stake-start-table__form'} noValidate autoComplete="off">
                            <div className="stake-start-table__search">
                                <SearchIcon />
                                <input className="stake-start-table__input" type="text" placeholder="Search" value={this.formValue} />
                            </div>
                            <div className="stake-start-table__button">
                                <Button
                                    className='stake-start-table__btn'
                                    onClick={this.unlockClicked}
                                    disabled={loading}
                                >
                                    <Typography>Exchange AD3</Typography>
                                </Button>
                            </div>
                        </form>
                    </div>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Assets</TableCell>
                                    <TableCell>Total deposit</TableCell>
                                    <TableCell>Total loan</TableCell>
                                    <TableCell>Utillzation rate</TableCell>
                                    <TableCell>APY</TableCell>
                                    <TableCell align="right">Operate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.calories}</TableCell>
                                    <TableCell>{row.fat}</TableCell>
                                    <TableCell className="table-progress">
                                        <div className="table-progress-content">
                                            <Progress num={row.carbs}></Progress><span>{row.carbs * 100}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="table-progress-content table-apy-content">
                                            <span className="table-apy">{row.protein}</span>
                                            <ErrorOutlineIcon />
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            className='stake-table-btn'
                                            onClick={this.unlockClicked}
                                            disabled={loading}
                                        >
                                            Deposit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>
                {/* <Typography variant={'h5'} className={classes.disaclaimer + ' ea_header_tit'}>{t('Stake.RiskWarn')}</Typography>
                <div className={classes.intro}>
                    <Card className='addressContainer' onClick={this.overlayClicked}>
                        <Typography variant={'h3'} className={classes.walletTitle} noWrap>{t('Stake.Wallet')}</Typography>
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
                <div className='overview'>
                    <div className={classes.overviewField}>
                        <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.YourBalance')}</Typography>
                        <Typography variant={'h2'}
                                    className={classes.overviewValue}>{pool.tokens[0].balance ? pool.tokens[0].balance.toFixed(2) : "0"}
                            <i className='symbol_name'>{pool.tokens[0].symbol}</i></Typography>
                    </div>
                    <div className={classes.overviewField}>
                        <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.CurrentlyStaked')}</Typography>
                        <Typography variant={'h2'}
                                    className={classes.overviewValue}>{pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(2) : "0"}</Typography>
                    </div>
                    <div className={classes.overviewField}>
                        <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.RewardsAvailable')}</Typography>
                        <Typography variant={'h2'} className={classes.overviewValue}>
                            {pool.tokens[0].rewardsAvailable ? pool.tokens[0].rewardsAvailable.toFixed(2) : "0"}<i className='symbol_name'> {pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : ''}</i>
                        </Typography>
                    </div>
                    {['GovernanceV2Dai'].includes(pool.id) &&
                    <div className={classes.overviewField}>
                        <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.APY')}</Typography>
                        <Typography variant={'h2'} className={classes.overviewValue}>
                            {daiRoi || t('Stake.Calc')}
                        </Typography>
                    </div>
                    }
                    {['GovernanceV2Kani'].includes(pool.id) &&
                    <div className={classes.overviewField}>
                        <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.APY')}</Typography>
                        <Typography variant={'h2'} className={classes.overviewValue}>
                            {kaniRoi || t('Stake.Calc')}
                        </Typography>
                    </div>
                    }
                </div>
                {['FeeRewards'].includes(pool.id) &&
                <div className={classes.actions}>
                    <Typography className={classes.stakeTitle} variant={'h3'}>yCRV reward requirements</Typography>
                    <div className={classes.requirement}>
                        <Typography variant={'h4'}>You must have voted in a proposal recently</Typography><Typography
                        variant={'h4'} className={classes.check}>{voteLockValid ?
                        <CheckIcon style={{color: colors.green}}/> :
                        <ClearIcon style={{color: colors.red}}/>}</Typography>
                    </div>
                    <div className={classes.requirement}>
                        <Typography variant={'h4'}>You must have at least 1000 BPT staked in the Governance
                            pool</Typography><Typography variant={'h4'} className={classes.check}>{balanceValid ?
                        <CheckIcon style={{color: colors.green}}/> :
                        <ClearIcon style={{color: colors.red}}/>}</Typography>
                    </div>
                </div>
                }
                {value === 'options' && this.renderOptions()}
                {value === 'stake' && this.renderStake()}
                {value === 'claim' && this.renderClaim()}
                {value === 'unstake' && this.renderUnstake()}
                {value === 'exit' && this.renderExit()}

                {snackbarMessage && this.renderSnackbar()}
                {loading && <Loader/>} */}
            </div>
        )
    }

    renderOptions = () => {
        const {classes,t} = this.props;
        const {
            loading,
            pool,
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
                            disabled={!pool.depositsEnabled || (['GovernanceV2 defi'].includes(pool.id) ? (loading || !voteLockValid || !balanceValid) : loading)}
                            onClick={() => {
                                this.navigateInternal('stake')
                            }}
                        >
                            <Typography  variant={'h4'}>{t('Stake.StakeTokens')}</Typography>
                        </Button>
                    </div>
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        <Button
                            fullWidth
                            className={classes.actionButton}
                            variant="outlined"
                            color="primary"
                            disabled={loading || (['GovernanceV2'].includes(pool.id) && !gov_voteLockValid)}
                            onClick={() => {
                                this.onClaim()
                            }}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>{t('Stake.ClaimRewards')}</Typography>
                        </Button>
                    </div>
                </div>
                <div className="btn2-flex">
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        {!['GovernanceV2 defi'].includes(pool.id) &&
                        <Button
                            fullWidth
                            className={classes.actionButton}
                            variant="outlined"
                            color="primary"
                            disabled={loading || (['GovernanceV2'].includes(pool.id) && gov_voteLockValid) || (pool.id === 'Governance' && (voteLockValid))}
                            onClick={() => {
                                this.navigateInternal('unstake')
                            }}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>{t('Stake.UnstakeTokens')}</Typography>
                        </Button>
                        }
                    </div>
                    <div className={classes.actionContainer + ' ea_button_btn'}>
                        {!['GovernanceV2 defi','GovernanceV2Kani'].includes(pool.id) &&
                        <Button
                            fullWidth
                            className={classes.actionButton}
                            variant="outlined"
                            color="primary"
                            disabled={(pool.id === 'Governance' ? (loading || voteLockValid) : loading)}
                            onClick={() => {this.onExit()}}
                        >
                            <Typography className={classes.stakeButtonText} variant={'h4'}>{t('Stake.Exit')}</Typography>
                        </Button>
                        }
                    </div>
                </div>

                {(['Governance', 'GovernanceV2'].includes(pool.id) && voteLockValid) &&
                <Typography variant={'h4'} className={classes.voteLockMessage}>Unstaking tokens only allowed once all
                    your pending votes have closed at Block: {voteLock}</Typography>}
                {(['GovernanceV2'].includes(pool.id) && !gov_voteLockValid) &&
                <Typography variant={'h4'} className={classes.voteLockMessage}>You need to have voted recently in order
                    to claim rewards</Typography>}
                {(['GovernanceV2'].includes(pool.id) && gov_voteLockValid) &&
                <Typography variant={'h4'} className={classes.voteLockMessage}>You have recently voted, you can unstake
                    at block {gov_voteLock}</Typography>}
            </div>
        )
    }

    navigateInternal = (val) => {
        // console.log('come stake', val)
        this.setState({value: val})
    }

    renderStake = () => {
        const {classes,t} = this.props;
        const {loading, pool} = this.state

        const asset = pool.tokens[0]
        // console.log('asset', asset)

        return (
            <div className={classes.actions + ' ea_button_box'}>
                <Typography className={classes.stakeTitle} variant={'h3'}><span className='left'>{t('Stake.StakeYourTokens')}</span>
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
                        <Typography variant={'h4'}>{t('Stake.Back')}</Typography>
                    </Button>
                    <Button
                        className={classes.stakeButton + ' confirm_btn_item'}
                        variant="outlined"
                        color="secondary"
                        disabled={loading}
                        onClick={() => {
                            this.onStake()
                        }}
                    >
                        <Typography variant={'h4'}>{t('Stake.StakeTokens')}</Typography>
                    </Button>
                </div>

            </div>
        )
    }

    renderUnstake = () => {
        const {classes,t} = this.props;
        const {loading, pool, voteLockValid} = this.state

        const asset = pool.tokens[0]

        return (
            <div className={classes.actions + ' ea_button_box'}>
                <Typography className={classes.stakeTitle} variant={'h3'}><span className='left'>{t('Stake.UnstakeYourTokens')}</span>
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
                        <Typography variant={'h4'}>{t('Stake.Back')}</Typography>
                    </Button>
                    <Button
                        className={classes.stakeButton + ' confirm_btn_item'}
                        variant="outlined"
                        color="secondary"
                        disabled={(pool.id === 'Governance' ? (loading || voteLockValid) : loading)}
                        onClick={() => {
                            this.onUnstake()
                        }}
                    >
                        <Typography variant={'h4'}>{t('Stake.UnstakeTokens')}</Typography>
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

    onStake = () => {

        this.setState({amountError: false})
        const {pool} = this.state
        const tokens = pool.tokens
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

    onClaim = () => {
        const {pool} = this.state
        const tokens = pool.tokens
        const selectedToken = tokens[0]

        this.setState({loading: true})
        dispatcher.dispatch({type: GET_REWARDS, content: {asset: selectedToken}})
    }

    onUnstake = () => {
        this.setState({amountError: false})
        const {pool} = this.state
        const tokens = pool.tokens
        const selectedToken = tokens[0]
        const amount = this.state[selectedToken.id + '_unstake']
        //
        // if(amount > selectedToken.balance) {
        //   return false
        // }

        this.setState({loading: true})
        dispatcher.dispatch({type: WITHDRAW, content: {asset: selectedToken, amount: amount}})
    }

    onExit = () => {
        const {pool} = this.state
        const tokens = pool.tokens
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
        const {pool} =this.state.pool
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

    navigateStake = (rewardPool) => {
        store.setStore({currentPool: rewardPool})
        const pool = store.getStore('currentPool').target.value
        this.setState({pool: pool})
        dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        // console.log('path',props.location.pathname)
        // if(props.location.pathname !== '/stake'){
        //     console.log('23')
        // }
    }

    setAmount = (id, type, balance) => {
        const bal = (Math.floor((balance === '' ? '0' : balance) * 10000) / 10000).toFixed(4)
        let val = []
        val[id + '_' + type] = bal
        this.setState(val)
    }

}


export default withTranslation()(withRouter(withStyles(styles)(Stake)));
