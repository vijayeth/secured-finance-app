/// <reference types="cypress" />
import { expectFilecoin, filecoin } from 'support/filecoin';
import * as wallets from '../../fixtures/filecoin.json';

describe('Filecoin Wallet', () => {
    const assertFilecoinWalletNotConnected = () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').should('be.visible');
        cy.get('[data-cy="filecoin-settings-chip"]').should('not.exist');
        chai.expect(localStorage.getItem('FIL_WALLET_TYPE')).to.not.exist;
        chai.expect(localStorage.getItem('FIL_ADDRESS')).to.not.exist;
    };

    beforeEach(() => {
        cy.connectWallet().then(() => {
            expectFilecoin.walletNotConnected();
        });
    });

    it('should offer three choices when trying to connect', () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').click();
        cy.contains('Select a wallet provider').should('be.visible');
        cy.contains('Private Key').should('be.visible');
        cy.contains('Ledger wallet').should('be.visible');
        cy.contains('Mnemonic phrase').should('be.visible');
        cy.get('[data-cy="cancel-button"]').should('be.visible').click();
    });

    it('should connect to a new filecoin wallet when using mnemonic phrase and disconnect', () => {
        cy.get('[data-cy="filecoin-connect-wallet-chip"]').click();
        cy.get('[data-cy="generate-button"]').click();
        cy.get('[data-cy="save-button"]')
            .click()
            .then(() => {
                expectFilecoin.walletConnected();
            });

        cy.get('[data-cy="wallet-address"]')
            .should('have.length', 2)
            .and(walletAddress => {
                chai.expect(walletAddress[0].textContent).to.be.equal('...');
                chai.expect(walletAddress[1].textContent).to.be.equal('...');
            });

        cy.get('[data-cy="filecoin-settings-chip"]').click();
        cy.get('[data-cy="sign-out-button"]').click();

        cy.get('[data-cy="wallet"]')
            .click()
            .then(() => {
                expectFilecoin.walletNotConnected();
            });
    });

    it('should connect to an existing account when importing an account with a mnemonic phrase', () => {
        filecoin.connectWallet(wallets.walletAlice);
        filecoin.disconnectWallet();
    });

    it('should transfer FIL to an existing account', () => {
        filecoin.connectWallet(wallets.walletBob);
        cy.get('[data-cy="filecoin-send-chip"]')
            .click()
            .then(() => {
                cy.get('[data-cy="send-modal"]').should('be.visible');
            });
        cy.get('[data-cy="send-button"]').should('be.disabled');
        cy.get('[data-cy="send-address-input"]').type(
            wallets.walletCharlie.address
        );
        cy.get('[data-cy="send-amount-input"]').type('1');
        cy.get('[data-cy="send-button"]')
            .should('not.be.disabled')
            .wait(2000)
            .click()
            .then(() => {
                cy.get('[data-cy="send-modal"]').should('not.exist');
            });
    });
});
