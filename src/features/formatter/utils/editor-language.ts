import type { EditorLanguage } from '../model/types';
import { LANGUAGE_OPTIONS } from '../constants';

export function isJsonEditorLanguage(language: EditorLanguage): boolean {
  return language === 'json';
}

export function editorLanguageLabel(language: EditorLanguage): string {
  return LANGUAGE_OPTIONS.find((o) => o.value === language)?.label ?? language;
}
