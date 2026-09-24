import { Redirect, useLocalSearchParams } from 'expo-router';

import { EditScreen, isEditField } from '@/features/profil/EditScreen';

/** Editing name and gender, the old habits or the quit date, from Profil (docs/M5-brief.md). */
export default function EditRoute() {
  const { polje } = useLocalSearchParams<{ polje?: string }>();
  if (!isEditField(polje)) return <Redirect href="/profil" />;
  return <EditScreen field={polje} />;
}
