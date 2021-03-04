import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import theme from '../../../../../theme';
import Button from '../../../../../components/Button';
import TermsSelector from '../../../../../components/TermsSelector';
import { terms } from '../../../../../utils';

const Lend: React.FC = () => {
    const [interestRate, setInterestRate] = useState('')
    const [lendAmount, setLendAmount] = useState('')
    const [selectedTerms, setSelectedTerms] = useState('3mo')
    const [termsOpen, setTermsOpen] = useState(false)

    const handleOpenTerms = useCallback((termsOpen:boolean) => {
        setTermsOpen(!termsOpen)
    },[setTermsOpen])

    // const fullBalance = useMemo(() => {
    //     return getFullDisplayBalance(max)
    // }, [max])

    // const handleSelectMax = useCallback(() => {
    //     setCollateralAmount(fullBalance)
    // }, [fullBalance, setCollateralAmount])
    
    const handleInterest = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setInterestRate(e.currentTarget.value)
    },[setInterestRate])

    const handleLend = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setLendAmount(e.currentTarget.value)
    },[setLendAmount])

    const handleTermSelect = useCallback((value:string, termsOpen:boolean) => {
        setSelectedTerms(value)
        setTermsOpen(!termsOpen)
    },[setSelectedTerms, setTermsOpen])

    return (
        <StyledLoanContainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel>Amount FIL</StyledLoanLabel>
                    <StyledLoanLabel textDecoration={'underline'}>Balance: 0.00</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledLoanInput 
                    type={'number'}
                    placeholder={'0'}
                    value={lendAmount}
                    onChange={handleLend}
                />
            </StyledLoanSubcontainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel>Term</StyledLoanLabel>
                </StyledLabelContainer>
                <TermsSelectorContainer>
                    <TermsSelector
                        selectedTerm={selectedTerms}
                        onClick={() => handleOpenTerms(termsOpen)}
                        style={{
                            fontSize:theme.sizes.caption,
                            fontWeight: 400,
                        }}
                    />
                    { termsOpen 
                        ? 
                        <StyledDropdown>
                            <ul>
                                {
                                    terms.map((term, i) => (
                                        <StyledDropdownItem 
                                            key={i}
                                            onClick={() => handleTermSelect(term.term, termsOpen)}
                                        >
                                            <StyledCurrencyText>{term.text}</StyledCurrencyText>
                                        </StyledDropdownItem>
                                    ))
                                }
                            </ul>
                        </StyledDropdown> 
                        : 
                        null 
                    }
                </TermsSelectorContainer>
            </StyledLoanSubcontainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel>Interest rate</StyledLoanLabel>
                    <StyledLoanLabel textDecoration={'underline'}>Market Rate: 7.10 %</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledLoanInput 
                    type={'number'}
                    placeholder={'0'}
                    value={interestRate}
                    onChange={handleInterest}
                />
            </StyledLoanSubcontainer>
            <StyledLabelContainer>
                <StyledLoanInfoLabel>Available to lend</StyledLoanInfoLabel>
                <StyledLoanInfoLabel color={theme.colors.white}>0 FIL</StyledLoanInfoLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanInfoLabel>Order Amount (USD)</StyledLoanInfoLabel>
                <StyledLoanInfoLabel color={theme.colors.white}>0$</StyledLoanInfoLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanInfoLabel>Estimated returns</StyledLoanInfoLabel>
                <StyledLoanInfoLabel color={theme.colors.white}>0$</StyledLoanInfoLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanInfoLabel>FIL Balance after trade</StyledLoanInfoLabel>
                <StyledLoanInfoLabel color={theme.colors.white}>0 FIL</StyledLoanInfoLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanInfoLabel >Transaction fee</StyledLoanInfoLabel>
                <StyledLoanInfoLabel color={theme.colors.white}>1.2$</StyledLoanInfoLabel>
            </StyledLabelContainer>
            <StyledButtonContainer>
                <Button 
                    size={"lg"}
                    style={{ 
                        borderBottom: '1px solid' + theme.colors.red3,
                        background: 'transparent',
                        borderColor: theme.colors.red3,
                        borderWidth: 1,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: 12,
                        color: theme.colors.white 
                    }}
                >
                    Lend
                </Button>
            </StyledButtonContainer>
        </StyledLoanContainer>
    );
}

const StyledLoanContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const StyledLoanSubcontainer = styled.div`
    margin-bottom: ${(props) => props.theme.spacing[3]-1}px;
`

interface StyledLoanLabelProps {
    textTransform?: string,
    textDecoration?: string,
    fontWeight?: number,
    fontSize?: number,
    color?: string
}

const StyledLoanLabel = styled.div<StyledLoanLabelProps>`
    text-decoration: ${(props) => props.textDecoration ? props.textDecoration : 'none' };
    text-transform: ${(props) => props.textTransform ? props.textTransform : 'capitalize' };
    font-size: ${(props) => props.fontSize ? props.fontSize : props.theme.sizes.caption2}px;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    margin-top: 0px;
    font-weight: ${(props) => props.fontWeight ? props.fontWeight :600};
    color: ${props => props.theme.colors.gray};
`

const StyledLoanInfoLabel = styled.p<StyledLoanLabelProps>`
    text-transform: ${(props) => props.textTransform ? props.textTransform : 'capitalize' };
    font-size: ${(props) => props.fontSize ? props.fontSize : props.theme.sizes.caption2}px;
    margin-bottom: ${(props) => props.theme.spacing[2]-1}px;
    margin-top: 0px;
    font-weight: ${(props) => props.fontWeight ? props.fontWeight : 500};
    color: ${props => props.color ? props.color : props.theme.colors.gray};
`

const StyledLoanInput = styled.input`
    background-color: transparent;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    padding: 12px 12px;
    font-size: ${props => props.theme.sizes.caption}px;
    outline: none;
    color: ${props => props.theme.colors.white};
    width: calc(100% - 22px);
    -webkit-appearance: none;
    -moz-appearance: textfield;
`

const StyledButtonContainer = styled.div`
    margin-top: 13px;
`

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${(props) => props.marginLeft ? props.marginLeft : '7px'};
    text-align: left;
    color: ${(props) => props.theme.colors.black};
`

const TermsSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: transparent;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    height: 42px;
    padding: 0px 10px;
    font-size: 14px;
    outline: none;
    color: ${props => props.theme.colors.white};
`

const StyledDropdown = styled.div`
    position: relative;
    top: 5px;
    left: 5px;
    
    ul {
        background: white;
        position: absolute;
        z-index: 2;
        min-width: 120px;
        border-radius: 3px;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    li:hover {
        background-color: rgba(232, 232, 233, 0.4);
        cursor: pointer;
    }

    li:last-child {
        border-bottom: none;
    }
`

const StyledDropdownItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 8px;
    border-bottom: 0.5px solid ${(props) => props.theme.colors.lightGray[1]};
`

export default Lend