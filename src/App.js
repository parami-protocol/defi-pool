import React, {Component
    // useCallback, useEffect, useState
} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {
    Switch,
    Route,
    HashRouter
} from "react-router-dom";
// import IpfsRouter from 'ipfs-react-router'

import './i18n';
import interestTheme from './theme';

import Account from './components/account';
import Home from './components/home';
import Stake from './components/stake';
import RewardsPools from './components/rewardPools';
import Header from './components/header';
import Footer from './components/footer';
import Liquidity from './components/liquidity';
// import Propose from './components/propose';
// import Claim from './components/claim';
// import Vote from './components/vote';
// import VersionToggle from './components/versionToggle';
// import Lock from './components/lock';

import {
    CONNECTION_CONNECTED,
    CONNECTION_DISCONNECTED,
    CONFIGURE,
    CONFIGURE_RETURNED,
    GET_BALANCES_PERPETUAL,
    GET_BALANCES_PERPETUAL_RETURNED
} from './constants'

import {injected} from "./stores/connectors";

import Store from "./stores";
// import bgImage from "./assets/bg-pc.jpg";
// import bgMobile from "./assets/bg-mobile.jpg";
import './assets/index.scss';
// import Liquality from "./components/liquidity/liquidity";

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


class App extends Component {
    state = {
        account: null,
        headerValue: null,
        clientWidth: 1024
    };

    setHeaderValue = (newValue) => {
        this.setState({headerValue: newValue})
    };


    componentWillMount() {
        emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
        emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
        emitter.on(CONFIGURE_RETURNED, this.configureReturned);
        emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
        window.addEventListener('resize', this.handleResize.bind(this))

        injected.isAuthorized().then(isAuthorized => {
            if (isAuthorized) {
                injected.activate()
                    .then((a) => {
                        store.setStore({account: {address: a.account}, web3context: {library: {provider: a.provider}}})
                        emitter.emit(CONNECTION_CONNECTED)
                        console.log(a)
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            } else {

            }
        });
    }

    componentWillUnmount() {
        emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
        emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
        emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
        emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
        window.removeEventListener('resize', this.handleResize.bind(this))
    };

    handleResize = (e) => {
        console.log(e.target.innerWidth);
        this.setState({
            clientWidth: e.target.innerWidth
        })
    }

    getBalancesReturned = () => {
        window.setTimeout(() => {
            dispatcher.dispatch({type: GET_BALANCES_PERPETUAL, content: {}})
        }, 300000)
    }

    configureReturned = () => {
        dispatcher.dispatch({type: GET_BALANCES_PERPETUAL, content: {}})
    }

    connectionConnected = () => {
        this.setState({account: store.getStore('account')})
        dispatcher.dispatch({type: CONFIGURE, content: {}})
    };

    connectionDisconnected = () => {
        this.setState({account: store.getStore('account')})
    }

    render() {
        const styleApp = {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            minWidth: '100vw',
            justifyContent: 'center',
            alignItems: 'center',
            background: "#081125",
            // backgroundImage: this.state.clientWidth < 760 ? `url(${bgMobile})` : `url(${bgImage})`,
            // backgroundImage: `url(${bgMobile})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
        }
        // headerValue, 
        const {account} = this.state

        return (
            <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
                <CssBaseline/>
                <HashRouter basename="/">
                    {!account &&
                    <div style={styleApp}>
                        <Header/>
                        <Account/>
                    </div>
                    }
                    {account &&
                    <div style={styleApp}>
                        <Switch>
                            <Route path="/stake">
                                <Header/>
                                <Stake/>
                            </Route>
                            <Route path="/staking">
                                <Header/>
                                {/*<VersionToggle/>*/}
                                <RewardsPools/>
                            </Route>
                            <Route path="/liquidity">
                                <Header/>
                                {/*<VersionToggle/>*/}
                                <Liquidity/>
                            </Route>
                            {/*<Route path="/vote">*/}
                            {/*<Header/>*/}
                            {/*<VersionToggle/>*/}
                            {/*<Vote/>*/}
                            {/*</Route>*/}
                            {/*<Route path="/propose">*/}
                            {/*<Header/>*/}
                            {/*<VersionToggle/>*/}
                            {/*<Propose/>*/}
                            {/*</Route>*/}
                            {/*<Route path="/lock">*/}
                            {/*<Header/>*/}
                            {/*<Lock/>*/}
                            {/*</Route>*/}
                            <Route path="/">
                                <Header/>
                                <Home/>
                            </Route>
                        </Switch>
                        <Footer/>
                    </div>
                    }
                </HashRouter>
            </MuiThemeProvider>
        );
    }
}

export default App;
