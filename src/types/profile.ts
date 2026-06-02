export type ProfileSettings = {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  location?: string | null;
  website?: string | null;
  pronouns?: string | null;
  privacyLevel: string;
  profileSettings?: {
    showActivity: boolean;
    showLibraries: boolean;
    showBadges: boolean;
    allowMessages: boolean;
    allowMentions: boolean;
  } | null;
};

