import React, { useEffect } from 'react'
import styled from 'styled-components'
import seedLogo from '../../../assets/img/seed.svg'
import keyLogo from '../../../assets/img/key.svg'

import { ModalProps } from '../../Modal'
import Spacer from '../../Spacer'

import WalletCard from './WalletCard'
import useModal from '../../../hooks/useModal'
import MnemonicModal from './MnemonicModal'
import PrivateKeyModal from './PrivateKeyModal'

const FilWalletConnector: React.FC<ModalProps> = ({ onDismiss }) => {
    const [onMnemonicModal] = useModal(<MnemonicModal />)
    const [onPrivateKeyModal] = useModal(<PrivateKeyModal />)

	return (
		<StyledWalletsWrapper>
			<StyledWalletCard>
				<WalletCard
					icon={<img src={seedLogo} style={{ height: 24 }} />}
					onConnect={onMnemonicModal}
					title="Mnemonic phrase"
					buttonText="Generate"
				/>
			</StyledWalletCard>
			<Spacer size="sm" />
			<StyledWalletCard>
				<WalletCard
					icon={<img src={keyLogo} style={{ height: 24 }} />}
					onConnect={onPrivateKeyModal}
					title="Private Key"
					buttonText="Import"
				/>
			</StyledWalletCard>
		</StyledWalletsWrapper>
	)
}

const StyledWalletsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	@media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
		flex-direction: column;
		flex-wrap: none;
	}
`

const StyledWalletCard = styled.div`
	flex-basis: calc(50% - ${(props) => props.theme.spacing[2]/2}px);
`

export default FilWalletConnector
