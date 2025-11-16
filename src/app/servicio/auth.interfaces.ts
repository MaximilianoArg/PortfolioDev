export interface Profile {
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile: Profile;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}