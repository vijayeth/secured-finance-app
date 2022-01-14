import LendingMarketControllerAbi from './abi/LendingMarketController.json'
import LendingMarketAbi from './abi/LendingMarket.json'
import LoanAbi from './abi/Loan.json'
import CollateralAbi from './abi/Collateral.json'

import {
    contractsAddresses,
    SUBTRACT_GAS_LIMIT,
} from './utils.js'
import { lendingMarkets } from './utils'
import * as Types from './types.js'

export class Contracts {
    constructor(provider, networkId, web3, options) {
        this.web3 = web3
        this.defaultConfirmations = options.defaultConfirmations
        this.autoGasMultiplier = options.autoGasMultiplier || 1.5
        this.confirmationType =
        options.confirmationType || Types.ConfirmationType.Confirmed
        this.defaultGas = options.defaultGas
        this.defaultGasPrice = options.defaultGasPrice

        this.lendingController = new this.web3.eth.Contract(LendingMarketControllerAbi)
        this.loan = new this.web3.eth.Contract(LoanAbi)
        this.collateral = new this.web3.eth.Contract(CollateralAbi)
        // this.usdc = new this.web3.eth.Contract(USDCAbi)

        this.lendingMarkets = lendingMarkets.map((ccyMarkets) => {
            return {
                ccy : ccyMarkets.ccyIndex,
                markets: ccyMarkets.markets.map((lendingMarket) => {
                    return {
                        term: lendingMarket.termIndex,
                        lendingMarket: new this.web3.eth.Contract(LendingMarketAbi),
                        lendingMarketAddress: lendingMarket.address
                    }
                })
            }
        })

        this.setProvider(provider, networkId)
        this.setDefaultAccount(this.web3.eth.defaultAccount)
    }

    setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
        contract.setProvider(provider)
        if (address) contract.options.address = address
        else console.error('Contract address not found in network', networkId)
    }

    setProvider(this.lendingController, contractsAddresses.lendingController)
    setProvider(this.loan, contractsAddresses.loan)
    setProvider(this.collateral, contractsAddresses.collateral)

    this.lendingMarkets.forEach((ccyMarket) => {
        ccyMarket.markets.forEach(({lendingMarket, lendingMarketAddress}) => {
            setProvider(lendingMarket, lendingMarketAddress)
        })
    })
  }

    setDefaultAccount(account) {
        this.lendingController.options.from = account
    }

    async setGasLimit() {
        const block = await this.web3.eth.getBlock('latest')
        this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT
    }
}
