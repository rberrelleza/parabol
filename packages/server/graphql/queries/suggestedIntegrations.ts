import {GraphQLNonNull, GraphQLResolveInfo} from 'graphql'
import ms from 'ms'
import {getUserId} from '../../utils/authorization'
import standardError from '../../utils/standardError'
import {GQLContext} from '../graphql'
import SuggestedIntegrationQueryPayload from '../types/SuggestedIntegrationQueryPayload'
import fetchAllIntegrations from './helpers/fetchAllIntegrations'
import {
  getPermsByTaskService,
  getTeamIntegrationsByTeamId,
  IntegrationByTeamId,
  useOnlyUserIntegrations
} from './helpers/suggestedIntegrationHelpers'

export default {
  description: 'The integrations that the user would probably like to use',
  type: new GraphQLNonNull(SuggestedIntegrationQueryPayload),
  resolve: async (
    {teamId, userId}: {teamId: string; userId: string},
    _args: unknown,
    context: GQLContext,
    info: GraphQLResolveInfo
  ) => {
    const {authToken, dataLoader} = context
    const viewerId = getUserId(authToken)

    // AUTH
    if (userId !== viewerId) {
      const user = await dataLoader.get('users').load(userId)
      const {tms} = user!
      const onTeam = authToken.tms.find((teamId) => tms!.includes(teamId))
      if (!onTeam) {
        return standardError(new Error('Not on same team as user'), {userId: viewerId})
      }
    }
    const permLookup = await getPermsByTaskService(dataLoader, teamId, userId)
    const teamIntegrationsByTeamId = await getTeamIntegrationsByTeamId(teamId, permLookup)

    // if the team has no integrations, return every possible integration for the user
    if (!teamIntegrationsByTeamId.length) {
      const items = await fetchAllIntegrations(dataLoader, teamId, userId, context, info)
      return {items, hasMore: false}
    }
    const userIntegrationsForTeam = useOnlyUserIntegrations(teamIntegrationsByTeamId, userId)
    if (userIntegrationsForTeam) {
      return {items: userIntegrationsForTeam, hasMore: true}
    }

    const aMonthAgo = new Date(Date.now() - ms('30d'))
    const recentUserIntegrations = teamIntegrationsByTeamId.filter(
      (integration) => integration.userId === userId && integration.lastUsedAt >= aMonthAgo
    )

    const idSet = new Set()
    const dedupedTeamIntegrations = [] as IntegrationByTeamId[]
    const userAndTeamItems = [...recentUserIntegrations, ...teamIntegrationsByTeamId]
    // dedupes for perms, user vs team items, as well as possible name changes
    userAndTeamItems.forEach((integration) => {
      if (idSet.has(integration.id)) return
      idSet.add(integration.id)
      dedupedTeamIntegrations.push(integration)
    })

    // if other users have items that the viewer can't access, revert back to fetching everything
    if (userAndTeamItems.length === 0) {
      const items = await fetchAllIntegrations(dataLoader, teamId, userId, context, info)
      return {items, hasMore: false}
    }
    return {hasMore: true, items: dedupedTeamIntegrations}
  }
}
