import React from 'react'
import Panel from '../../../../components/Panel/Panel'
import OrgBillingReassuranceQuote from './OrgBillingReassuranceQuote'
import UpgradeBenefits from '../../../../components/UpgradeBenefits'
import PrimaryButton from '../../../../components/PrimaryButton'
import styled from '@emotion/styled'
import DialogTitle from '../../../../components/DialogTitle'
import useModal from '../../../../hooks/useModal'
import CreditCardModal from '../CreditCardModal/CreditCardModal'
import {createFragmentContainer} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {OrgBillingUpgrade_organization} from '__generated__/OrgBillingUpgrade_organization.graphql'
import {TierEnum} from '../../../../types/graphql'

const Inner = styled('div')({
  margin: '0 auto',
  maxWidth: 312,
  padding: '20px 24px 24px',
})

const Quotes = styled(OrgBillingReassuranceQuote)({
  paddingBottom: 16
})

const ButtonBlock = styled('div')({
  paddingTop: 16
})

const Title = styled(DialogTitle)({
  padding: '0 0 12px'
})

const StyledPrimaryButton = styled(PrimaryButton)({
  display: 'block',
  fontSize: 15,
  height: 40,
  width: '100%'
})

interface Props {
  organization: OrgBillingUpgrade_organization
}

const OrgBillingUpgrade = (props: Props) => {
  const {organization} = props
  const {id: orgId, tier, orgUserCount} = organization
  const {activeUserCount} = orgUserCount
  const {togglePortal, closePortal, modalPortal} = useModal()
  return (
    <>
      {modalPortal(<CreditCardModal actionType={'upgrade'} closePortal={closePortal} orgId={orgId}
                                    activeUserCount={activeUserCount} />)}
      {tier === TierEnum.personal &&
      <Panel>
        <Inner>
          <Title>Upgrade to Pro</Title>
          <Quotes />
          <UpgradeBenefits />
          <ButtonBlock>
            <StyledPrimaryButton onClick={togglePortal}>{'Upgrade Now'}</StyledPrimaryButton>
          </ButtonBlock>
        </Inner>
      </Panel>
      }
    </>
  )
}

export default createFragmentContainer(
  OrgBillingUpgrade,
  {
    organization: graphql`
      fragment OrgBillingUpgrade_organization on Organization {
        id
        tier
        orgUserCount {
          activeUserCount
        }
      }`
  }
)
