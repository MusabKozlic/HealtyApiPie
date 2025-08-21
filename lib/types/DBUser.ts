export type DbUser = {
    id: string;
    auth0_id: string;
    email: string | null;
    email_verified: boolean;
    name: string | null;
    given_name: string | null;
    family_name: string | null;
    nickname: string | null;
    picture: string | null;
    locale: string | null;
    app_metadata: Record<string, any>;
    user_metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
};

export type DbUserInsert = Omit<DbUser, "id" | "created_at" | "updated_at">;
