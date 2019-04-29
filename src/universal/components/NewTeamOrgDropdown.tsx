import React from 'react'
import Menu from 'universal/components/Menu'
import {PortalState} from 'universal/hooks/usePortal'
import {PRO} from 'universal/utils/constants'
import TagPro from 'universal/components/Tag/TagPro'
import MenuItem from 'universal/components/MenuItem'
import DropdownMenuLabel from 'universal/components/DropdownMenuLabel'
import DropdownMenuItemLabel from 'universal/components/DropdownMenuItemLabel'
import {createFragmentContainer, graphql} from 'react-relay'
import {NewTeamOrgDropdown_organizations} from '__generated__/NewTeamOrgDropdown_organizations.graphql'

interface Props {
  closePortal: () => void
  defaultActiveIdx: number
  onChange: (orgId: string) => void
  organizations: NewTeamOrgDropdown_organizations
  portalState: PortalState
}

const NewTeamOrgDropdown = (props: Props) => {
  const {defaultActiveIdx, onChange, organizations, closePortal, portalState} = props
  return (
    <Menu
      ariaLabel={'Select the organization the new team belongs to'}
      closePortal={closePortal}
      defaultActiveIdx={defaultActiveIdx + 1}
      isDropdown
      portalState={portalState}
    >
      <DropdownMenuLabel>Select Organization:</DropdownMenuLabel>
      {organizations.map((anOrg) => {
        return (
          <MenuItem
            key={anOrg.id}
            label={
              <DropdownMenuItemLabel>
                <span>{anOrg.name}</span>
                {anOrg.tier === PRO && <TagPro />}
              </DropdownMenuItemLabel>
            }
            onClick={() => {
              onChange(anOrg.id)
            }}
          />
        )
      })}
    </Menu>
  )
}

export default createFragmentContainer(
  NewTeamOrgDropdown,
  graphql`
    fragment NewTeamOrgDropdown_organizations on Organization @relay(plural: true) {
      id
      name
      tier
    }
  `
)
