// Типы для словаря переводов
export interface Dictionary {
  settings: {
    title: string;
    save: string;
    saveSuccess: string;
    notifications: {
      title: string;
      subtitle: string;
      telegram: string;
      push: string;
      whatsapp: string;
      email: string;
    };
    coins: {
      title: string;
      selectAll: string;
      deselectAll: string;
      tariffWarning: string;
      upgradePlan: string;
      interval: {
        title: string;
        label: string;
        value: string;
        hint: string;
      };
      drop: {
        title: string;
        label: string;
        value: string;
        hintEnabled: string;
        hintDisabled: string;
      };
      growth: {
        title: string;
        label: string;
        value: string;
        hintEnabled: string;
        hintDisabled: string;
      };
    };
    app: {
      title: string;
      theme: {
        title: string;
        light: string;
        dark: string;
      };
      locale: {
        title: string;
        ru: string;
        en: string;
      };
    };
    version: string;
  };
}

// Тип для ключей перевода
export type TranslationKey = 
  | "settings.title"
  | "settings.save"
  | "settings.saveSuccess"
  | "settings.notifications.title"
  | "settings.notifications.subtitle"
  | "settings.notifications.telegram"
  | "settings.notifications.push"
  | "settings.notifications.whatsapp"
  | "settings.notifications.email"
  | "settings.coins.title"
  | "settings.coins.selectAll"
  | "settings.coins.deselectAll"
  | "settings.coins.tariffWarning"
  | "settings.coins.upgradePlan"
  | "settings.coins.interval.title"
  | "settings.coins.interval.label"
  | "settings.coins.interval.value"
  | "settings.coins.interval.hint"
  | "settings.coins.drop.title"
  | "settings.coins.drop.label"
  | "settings.coins.drop.value"
  | "settings.coins.drop.hintEnabled"
  | "settings.coins.drop.hintDisabled"
  | "settings.coins.growth.title"
  | "settings.coins.growth.label"
  | "settings.coins.growth.value"
  | "settings.coins.growth.hintEnabled"
  | "settings.coins.growth.hintDisabled"
  | "settings.app.title"
  | "settings.app.theme.title"
  | "settings.app.theme.light"
  | "settings.app.theme.dark"
  | "settings.app.locale.title"
  | "settings.app.locale.ru"
  | "settings.app.locale.en"
  | "settings.version";
