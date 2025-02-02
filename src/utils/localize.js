// Import translations
import * as en from '../translations/en.json';
import * as de from '../translations/de.json';

const DEFAULT_LANG = 'en';

export class Localize {
  constructor() {
    this._strings = {
      'en': en.default || en,
      'de': de.default || de,
    };
  }

  get language() {
    // Get language from Home Assistant
    return document.querySelector('home-assistant')?.hass?.language || DEFAULT_LANG;
  }

  localize(string, params = {}) {
    const lang = this.language;

    let translated;
    try {
      // Split the string into parts and traverse the translations object
      translated = string.split('.').reduce((obj, i) => obj[i], this._strings[lang] || this._strings[DEFAULT_LANG]);
      if (translated === undefined) {
        // Try fallback to English if translation not found
        translated = string.split('.').reduce((obj, i) => obj[i], this._strings[DEFAULT_LANG]);
      }
    } catch (e) {
      return string; // Return original string if translation fails
    }

    if (translated === undefined) {
      return string;
    }

    // Replace any parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translated = translated.replace(`{${key}}`, value);
      });
    }

    return translated;
  }

  // Helper method for card strings
  t(key, params = {}) {
    return this.localize(`ui.card.printwatch.${key}`, params);
  }
}

// Create and export a singleton instance
export const localize = new Localize();