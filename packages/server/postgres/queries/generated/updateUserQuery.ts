/** Types generated for queries found in "packages/server/postgres/queries/src/updateUserQuery.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type TierEnum = 'enterprise' | 'personal' | 'pro';

export type JsonArray = (null | boolean | number | string | Json[] | { [key: string]: Json })[];

/** 'UpdateUserQuery' parameters type */
export interface IUpdateUserQueryParams {
  ids: readonly (string | null | void)[];
  email: string | null | void;
  inactive: boolean | null | void;
  lastSeenAt: Date | null | void;
  preferredName: string | null | void;
  tier: TierEnum | null | void;
  picture: string | null | void;
  segmentId: string | null | void;
  isRemoved: boolean | null | void;
  isWatched: boolean | null | void;
  reasonRemoved: string | null | void;
  newFeatureId: string | null | void;
  identities: JsonArray | null | void;
  overLimitCopy: string | null | void;
}

/** 'UpdateUserQuery' return type */
export type IUpdateUserQueryResult = void;

/** 'UpdateUserQuery' query type */
export interface IUpdateUserQueryQuery {
  params: IUpdateUserQueryParams;
  result: IUpdateUserQueryResult;
}

const updateUserQueryIR: any = {"name":"updateUserQuery","params":[{"name":"ids","codeRefs":{"defined":{"a":36,"b":38,"line":3,"col":9},"used":[{"a":776,"b":778,"line":19,"col":13}]},"transform":{"type":"array_spread"}},{"name":"email","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":90,"b":94,"line":6,"col":20}]}},{"name":"inactive","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":130,"b":137,"line":7,"col":23}]}},{"name":"lastSeenAt","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":203,"b":212,"line":8,"col":50}]}},{"name":"preferredName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":261,"b":273,"line":9,"col":30}]}},{"name":"tier","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":313,"b":316,"line":10,"col":19}]}},{"name":"picture","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":350,"b":356,"line":11,"col":22}]}},{"name":"segmentId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":397,"b":405,"line":12,"col":26}]}},{"name":"isRemoved","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":448,"b":456,"line":13,"col":26}]}},{"name":"isWatched","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":499,"b":507,"line":14,"col":26}]}},{"name":"reasonRemoved","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":554,"b":566,"line":15,"col":30}]}},{"name":"newFeatureId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":616,"b":627,"line":16,"col":29}]}},{"name":"identities","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":674,"b":683,"line":17,"col":27}]}},{"name":"overLimitCopy","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":731,"b":743,"line":18,"col":30}]}}],"usedParamSet":{"email":true,"inactive":true,"lastSeenAt":true,"preferredName":true,"tier":true,"picture":true,"segmentId":true,"isRemoved":true,"isWatched":true,"reasonRemoved":true,"newFeatureId":true,"identities":true,"overLimitCopy":true,"ids":true},"statement":{"body":"UPDATE \"User\" SET\n  email = COALESCE(:email, \"email\"),\n  inactive = COALESCE(:inactive, \"inactive\"),\n  \"lastSeenAt\" = GREATEST(\"lastSeenAt\", COALESCE(:lastSeenAt, \"lastSeenAt\")),\n  \"preferredName\" = COALESCE(:preferredName, \"preferredName\"),\n  tier = COALESCE(:tier, \"tier\"),\n  picture = COALESCE(:picture, \"picture\"),\n  \"segmentId\" = COALESCE(:segmentId, \"segmentId\"),\n  \"isRemoved\" = COALESCE(:isRemoved, \"isRemoved\"),\n  \"isWatched\" = COALESCE(:isWatched, \"isWatched\"),\n  \"reasonRemoved\" = COALESCE(:reasonRemoved, \"reasonRemoved\"),\n  \"newFeatureId\" = COALESCE(:newFeatureId, \"newFeatureId\"),\n  \"identities\" = COALESCE(:identities, \"identities\"),\n  \"overLimitCopy\" = COALESCE(:overLimitCopy, \"overLimitCopy\")\nWHERE id IN :ids","loc":{"a":52,"b":778,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "User" SET
 *   email = COALESCE(:email, "email"),
 *   inactive = COALESCE(:inactive, "inactive"),
 *   "lastSeenAt" = GREATEST("lastSeenAt", COALESCE(:lastSeenAt, "lastSeenAt")),
 *   "preferredName" = COALESCE(:preferredName, "preferredName"),
 *   tier = COALESCE(:tier, "tier"),
 *   picture = COALESCE(:picture, "picture"),
 *   "segmentId" = COALESCE(:segmentId, "segmentId"),
 *   "isRemoved" = COALESCE(:isRemoved, "isRemoved"),
 *   "isWatched" = COALESCE(:isWatched, "isWatched"),
 *   "reasonRemoved" = COALESCE(:reasonRemoved, "reasonRemoved"),
 *   "newFeatureId" = COALESCE(:newFeatureId, "newFeatureId"),
 *   "identities" = COALESCE(:identities, "identities"),
 *   "overLimitCopy" = COALESCE(:overLimitCopy, "overLimitCopy")
 * WHERE id IN :ids
 * ```
 */
export const updateUserQuery = new PreparedQuery<IUpdateUserQueryParams,IUpdateUserQueryResult>(updateUserQueryIR);


