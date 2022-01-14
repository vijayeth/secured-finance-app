import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { cancelOrder, getLendingMarketContract } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const useCancelOrder = (ccy: number, term: number,  orderId: any) => {
    const securedFinance = useSF()
    const { account }: { account: string; ethereum: provider } = useWallet()
    const lendingMarket = getLendingMarketContract(securedFinance, ccy, term)
    
    const handleCancelOrder = useCallback(async () => {
      try {
        let tx = await cancelOrder(lendingMarket, account, orderId)
        return tx
      } catch (e) {
        return false
      }
    }, [account, lendingMarket, orderId])
  
    return { onCancelOrder: handleCancelOrder }
}
