import { StyleSheet } from 'react-native';
import { elevation } from '../theme/tokens';
import type { Colors } from '../theme/tokens';

export function tabBarChrome(colors: Colors, bottom: number, camera = false) {
  return {
    // Height must cover padding (9+11) + hairline (2) + icon (28) + gap (3) +
    // label (15). An explicit lineHeight on labels stops RN Web from
    // collapsing the line box (webfont metrics) and clipping the text.
    tabBarStyle: {
      backgroundColor: camera ? 'rgba(5, 8, 7, 0.88)' : colors.surface,
      borderColor: camera ? 'rgba(243, 247, 245, 0.14)' : colors.border,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 999,
      marginHorizontal: 16,
      marginBottom: bottom + 8,
      height: 68,
      paddingTop: 9,
      paddingBottom: 11,
      ...(camera ? undefined : elevation.float(colors)),
    },
    tabBarActiveTintColor: camera ? '#D8BC80' : colors.accent,
    tabBarInactiveTintColor: camera ? 'rgba(243, 247, 245, 0.55)' : colors.textMuted,
  };
}
