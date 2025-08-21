import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Auth0User } from "./types/auth0User";
import { DbUserInsert } from "./types/DBUser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function mapAuth0ToDb(user: Auth0User): DbUserInsert {
  return {
    auth0_id: user.sub,
    email: user.email ?? null,
    email_verified: user.email_verified ?? false,
    name: user.name ?? null,
    given_name: user.given_name ?? null,
    family_name: user.family_name ?? null,
    nickname: user.nickname ?? null,
    picture: user.picture ?? null,
    locale: user.locale ?? null,
    app_metadata: {},
    user_metadata: {},
  };
}
