// Типы для Telegram Login Widget API
declare global {
    interface Window {
        Telegram?: {
            Login: {
                auth: (
                    options: TelegramLoginOptions,
                    callback: (user: TelegramUser | false) => void
                ) => void;
            };
        };
    }
}

export interface TelegramLoginOptions {
    bot_id: string | number;
    request_access?: "write" | "read";
    bot_username?: string;
    size?: "large" | "medium" | "small";
    auth_url?: string;
}

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export { };
