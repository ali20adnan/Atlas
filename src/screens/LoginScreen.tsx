import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ScanLine } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { AppText, Button, Field, IconBtn, Kicker, Screen, useLayout } from '../components/ui';
import { elevation, radius, type } from '../theme/tokens';

export function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { lang, setLang } = useSettings();
  const { colors, row, isRTL } = useLayout();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [userErr, setUserErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [formErr, setFormErr] = useState('');

  async function onSubmit() {
    setFormErr('');
    const u = username.trim();
    let ok = true;
    if (!u) {
      setUserErr(t('usernameRequired'));
      ok = false;
    } else setUserErr('');
    if (!password) {
      setPassErr(t('passwordRequired'));
      ok = false;
    } else setPassErr('');
    if (!ok) return;
    setBusy(true);
    const success = await login(u, password);
    setBusy(false);
    if (!success) setFormErr(t('invalidCredentials'));
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flexDirection: row, alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <LinearGradient
            colors={colors.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 52,
              height: 52,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              ...elevation.cta(colors),
            }}
          >
            <ScanLine size={24} color="#F5E9CE" strokeWidth={1.75} />
          </LinearGradient>
          <Pressable
            onPress={() => void setLang(lang === 'ar' ? 'en' : 'ar')}
            accessibilityRole="button"
            accessibilityLabel={lang === 'ar' ? t('english') : t('arabic')}
            hitSlop={8}
            style={({ pressed }) => ({
              minHeight: 40,
              justifyContent: 'center',
              paddingHorizontal: 16,
              borderRadius: radius.full,
              backgroundColor: colors.surface,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
              ...elevation.card(colors),
            })}
          >
            <AppText weight="medium" style={{ fontSize: type.label }}>
              {lang === 'ar' ? 'English' : 'العربية'}
            </AppText>
          </Pressable>
        </View>

        <View style={{ marginTop: 44, gap: 10 }}>
          <Kicker>{t('orgName')}</Kicker>
          <AppText
            weight="bold"
            style={{ fontSize: type.display, lineHeight: 46, letterSpacing: isRTL ? 0 : -0.5 }}
          >
            {t('appName')}
          </AppText>
          <AppText tone="secondary" style={{ fontSize: type.body, lineHeight: 24, maxWidth: 300 }}>
            {t('appTagline')}
          </AppText>
        </View>

        <View style={{ marginTop: 40, gap: 16 }}>
            <Field
              label={t('username')}
              value={username}
              onChangeText={(v) => {
                setUsername(v);
                setUserErr('');
                setFormErr('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              autoComplete="username"
              error={userErr}
              returnKeyType="next"
            />
            <Field
              label={t('password')}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setPassErr('');
                setFormErr('');
              }}
              secureTextEntry={!show}
              textContentType="password"
              autoComplete="password"
              error={passErr}
              returnKeyType="done"
              onSubmitEditing={() => void onSubmit()}
              trailing={
                <IconBtn label={show ? t('hidePassword') : t('showPassword')} onPress={() => setShow((s) => !s)}>
                  {show ? (
                    <EyeOff size={18} color={colors.textMuted} strokeWidth={1.75} />
                  ) : (
                    <Eye size={18} color={colors.textMuted} strokeWidth={1.75} />
                  )}
                </IconBtn>
              }
            />
            {formErr ? (
              <AppText tone="danger" accessibilityRole="alert" style={{ fontSize: type.label }}>
                {formErr}
              </AppText>
            ) : null}
            <Button label={busy ? t('signingIn') : t('signIn')} loading={busy} onPress={() => void onSubmit()} />
          </View>

        <View style={{ marginTop: 'auto', marginBottom: 12, gap: 6, alignItems: 'center' }}>
          <Kicker tone="muted" style={{ letterSpacing: 1 }}>
            {t('demoHint')}
          </Kicker>
          <AppText tone="muted" style={{ fontSize: type.label }}>
            {t('demoAdmin')}
          </AppText>
          <AppText tone="muted" style={{ fontSize: type.label }}>
            {t('demoOp')}
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
