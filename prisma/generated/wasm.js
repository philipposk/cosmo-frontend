
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  email: 'email',
  emailVerified: 'emailVerified',
  username: 'username',
  supabaseId: 'supabaseId',
  displayName: 'displayName',
  hashedPassword: 'hashedPassword',
  bio: 'bio',
  avatarUrl: 'avatarUrl',
  coverUrl: 'coverUrl',
  privacyLevel: 'privacyLevel',
  badges: 'badges',
  roles: 'roles',
  ageGateStatus: 'ageGateStatus',
  parentalControlLevel: 'parentalControlLevel',
  location: 'location',
  website: 'website',
  pronouns: 'pronouns',
  onboardingCompleted: 'onboardingCompleted',
  lastActiveAt: 'lastActiveAt',
  isDemo: 'isDemo'
};

exports.Prisma.ProfileSettingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  showActivity: 'showActivity',
  showLibraries: 'showLibraries',
  showBadges: 'showBadges',
  allowMessages: 'allowMessages',
  allowMentions: 'allowMentions'
};

exports.Prisma.FollowScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  followerId: 'followerId',
  followingId: 'followingId',
  status: 'status',
  mute: 'mute',
  favorite: 'favorite'
};

exports.Prisma.FriendshipScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  initiatorId: 'initiatorId',
  recipientId: 'recipientId',
  status: 'status',
  context: 'context',
  lastInteractedAt: 'lastInteractedAt'
};

exports.Prisma.PrivacyRuleScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId',
  viewerId: 'viewerId',
  scope: 'scope',
  level: 'level',
  notes: 'notes'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires',
  userId: 'userId'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  authorId: 'authorId',
  title: 'title',
  content: 'content',
  category: 'category',
  visibility: 'visibility',
  likesCount: 'likesCount',
  commentsCount: 'commentsCount',
  tags: 'tags'
};

exports.Prisma.ReactionScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  postId: 'postId',
  userId: 'userId',
  kind: 'kind'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  postId: 'postId',
  authorId: 'authorId',
  parentId: 'parentId',
  body: 'body',
  deletedAt: 'deletedAt'
};

exports.Prisma.MediaScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId',
  kind: 'kind',
  status: 'status',
  bucket: 'bucket',
  objectKey: 'objectKey',
  contentType: 'contentType',
  sizeBytes: 'sizeBytes',
  width: 'width',
  height: 'height',
  durationMs: 'durationMs',
  metadata: 'metadata'
};

exports.Prisma.PostMediaScalarFieldEnum = {
  postId: 'postId',
  mediaId: 'mediaId',
  position: 'position'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  userId: 'userId',
  actorId: 'actorId',
  kind: 'kind',
  targetType: 'targetType',
  targetId: 'targetId',
  message: 'message',
  readAt: 'readAt'
};

exports.Prisma.LibraryItemScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId',
  title: 'title',
  description: 'description',
  category: 'category',
  visibility: 'visibility',
  tags: 'tags'
};

exports.Prisma.ForumScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ForumThreadScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  title: 'title',
  forumId: 'forumId',
  authorId: 'authorId',
  body: 'body',
  replyCount: 'replyCount'
};

exports.Prisma.ForumReplyScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  threadId: 'threadId',
  authorId: 'authorId',
  content: 'content'
};

exports.Prisma.GoalScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId',
  title: 'title',
  description: 'description',
  category: 'category',
  status: 'status',
  targetDate: 'targetDate'
};

exports.Prisma.GoalProgressScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  goalId: 'goalId',
  ownerId: 'ownerId',
  note: 'note',
  progress: 'progress'
};

exports.Prisma.DemoActivityLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  targetType: 'targetType',
  targetId: 'targetId',
  metadata: 'metadata',
  occurredAt: 'occurredAt'
};

exports.Prisma.MembershipTierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  priceCents: 'priceCents',
  currency: 'currency',
  maxStoriesPerDay: 'maxStoriesPerDay',
  maxWordsPerStory: 'maxWordsPerStory',
  priorityLevel: 'priorityLevel',
  availableModels: 'availableModels',
  stripePriceId: 'stripePriceId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserMembershipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tierId: 'tierId',
  status: 'status',
  trialEndsAt: 'trialEndsAt',
  currentPeriodEnd: 'currentPeriodEnd',
  stripeCustomerId: 'stripeCustomerId',
  stripeSubscriptionId: 'stripeSubscriptionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ModelProviderScalarFieldEnum = {
  id: 'id',
  label: 'label',
  identifier: 'identifier',
  description: 'description',
  family: 'family',
  maxWords: 'maxWords',
  baseCostUSD: 'baseCostUSD',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AIJobScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  prompt: 'prompt',
  tone: 'tone',
  genre: 'genre',
  safetyLevel: 'safetyLevel',
  status: 'status',
  errorMessage: 'errorMessage',
  resultStoryId: 'resultStoryId',
  modelId: 'modelId',
  priority: 'priority',
  queuedAt: 'queuedAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  tokensInput: 'tokensInput',
  tokensOutput: 'tokensOutput',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  synopsis: 'synopsis',
  body: 'body',
  visibility: 'visibility',
  status: 'status',
  modelId: 'modelId',
  safetyLevel: 'safetyLevel',
  flagged: 'flagged',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoryVersionScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  body: 'body',
  note: 'note',
  createdAt: 'createdAt',
  createdBy: 'createdBy'
};

exports.Prisma.StoryTagScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  key: 'key',
  value: 'value',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.ConnectedAppScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  appKey: 'appKey',
  status: 'status',
  accessToken: 'accessToken',
  scopes: 'scopes',
  metadata: 'metadata',
  lastSyncAt: 'lastSyncAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DailyUserUsageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  date: 'date',
  storiesQueued: 'storiesQueued',
  storiesCompleted: 'storiesCompleted',
  tokensConsumed: 'tokensConsumed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.PrivacyLevel = exports.$Enums.PrivacyLevel = {
  PUBLIC: 'PUBLIC',
  FRIENDS: 'FRIENDS',
  PRIVATE: 'PRIVATE'
};

exports.AgeGateStatus = exports.$Enums.AgeGateStatus = {
  UNKNOWN: 'UNKNOWN',
  VERIFIED_ADULT: 'VERIFIED_ADULT',
  VERIFIED_MINOR: 'VERIFIED_MINOR',
  PENDING: 'PENDING'
};

exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  MOD: 'MOD',
  ADMIN: 'ADMIN',
  EDUCATOR: 'EDUCATOR',
  CARETAKER: 'CARETAKER'
};

exports.FollowStatus = exports.$Enums.FollowStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  BLOCKED: 'BLOCKED'
};

exports.FriendshipStatus = exports.$Enums.FriendshipStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  ENDED: 'ENDED'
};

exports.PrivacyScope = exports.$Enums.PrivacyScope = {
  PROFILE: 'PROFILE',
  POSTS: 'POSTS',
  LIBRARY: 'LIBRARY',
  FORUMS: 'FORUMS',
  GOALS: 'GOALS'
};

exports.ContentCategory = exports.$Enums.ContentCategory = {
  BOOKS: 'BOOKS',
  COMICS: 'COMICS',
  ART: 'ART',
  MUSIC: 'MUSIC',
  PODCASTS: 'PODCASTS',
  GOALS: 'GOALS',
  FORUM: 'FORUM',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  UPDATE: 'UPDATE'
};

exports.VisibilityLevel = exports.$Enums.VisibilityLevel = {
  PUBLIC: 'PUBLIC',
  FRIENDS: 'FRIENDS',
  PRIVATE: 'PRIVATE'
};

exports.ReactionKind = exports.$Enums.ReactionKind = {
  LIKE: 'LIKE',
  LOVE: 'LOVE',
  INSPIRE: 'INSPIRE',
  TIP: 'TIP',
  BOOKMARK: 'BOOKMARK'
};

exports.MediaKind = exports.$Enums.MediaKind = {
  IMAGE: 'IMAGE',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT'
};

exports.MediaStatus = exports.$Enums.MediaStatus = {
  PENDING: 'PENDING',
  READY: 'READY',
  FAILED: 'FAILED'
};

exports.NotificationKind = exports.$Enums.NotificationKind = {
  FOLLOW_REQUEST: 'FOLLOW_REQUEST',
  FOLLOW_ACCEPTED: 'FOLLOW_ACCEPTED',
  POST_REACTION: 'POST_REACTION',
  POST_COMMENT: 'POST_COMMENT',
  COMMENT_REPLY: 'COMMENT_REPLY',
  AI_JOB_COMPLETE: 'AI_JOB_COMPLETE',
  MENTION: 'MENTION'
};

exports.DemoActivityAction = exports.$Enums.DemoActivityAction = {
  USER_CREATE: 'USER_CREATE',
  FOLLOW_CREATE: 'FOLLOW_CREATE',
  FRIENDSHIP_CREATE: 'FRIENDSHIP_CREATE',
  POST_CREATE: 'POST_CREATE',
  LIBRARY_CREATE: 'LIBRARY_CREATE',
  FORUM_THREAD_CREATE: 'FORUM_THREAD_CREATE',
  FORUM_REPLY_CREATE: 'FORUM_REPLY_CREATE',
  GOAL_CREATE: 'GOAL_CREATE',
  GOAL_PROGRESS_CREATE: 'GOAL_PROGRESS_CREATE'
};

exports.MembershipStatus = exports.$Enums.MembershipStatus = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED'
};

exports.AIJobStatus = exports.$Enums.AIJobStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.StoryVisibility = exports.$Enums.StoryVisibility = {
  PRIVATE: 'PRIVATE',
  UNLISTED: 'UNLISTED',
  PUBLIC: 'PUBLIC'
};

exports.StoryStatus = exports.$Enums.StoryStatus = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.ConnectedAppKey = exports.$Enums.ConnectedAppKey = {
  AI_OS: 'AI_OS',
  LIFEHUB: 'LIFEHUB',
  APPMAKER: 'APPMAKER',
  APPBLUEPRINTS: 'APPBLUEPRINTS'
};

exports.ConnectedAppStatus = exports.$Enums.ConnectedAppStatus = {
  CONNECTED: 'CONNECTED',
  PENDING: 'PENDING',
  DISCONNECTED: 'DISCONNECTED',
  COMING_SOON: 'COMING_SOON'
};

exports.Prisma.ModelName = {
  User: 'User',
  ProfileSetting: 'ProfileSetting',
  Follow: 'Follow',
  Friendship: 'Friendship',
  PrivacyRule: 'PrivacyRule',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  Post: 'Post',
  Reaction: 'Reaction',
  Comment: 'Comment',
  Media: 'Media',
  PostMedia: 'PostMedia',
  Notification: 'Notification',
  LibraryItem: 'LibraryItem',
  Forum: 'Forum',
  ForumThread: 'ForumThread',
  ForumReply: 'ForumReply',
  Goal: 'Goal',
  GoalProgress: 'GoalProgress',
  DemoActivityLog: 'DemoActivityLog',
  MembershipTier: 'MembershipTier',
  UserMembership: 'UserMembership',
  ModelProvider: 'ModelProvider',
  AIJob: 'AIJob',
  Story: 'Story',
  StoryVersion: 'StoryVersion',
  StoryTag: 'StoryTag',
  AuditLog: 'AuditLog',
  ConnectedApp: 'ConnectedApp',
  DailyUserUsage: 'DailyUserUsage'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
