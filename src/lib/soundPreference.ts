export const SOUND_KEY = 'gcpd:sound:v1';

export function parseSoundPreference(raw: string | null | undefined) {
  return raw === 'on';
}

export function serializeSoundPreference(enabled: boolean) {
  return enabled ? 'on' : 'off';
}
