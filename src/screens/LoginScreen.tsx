import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { AppText, Button, Field, IconBtn, Screen, useLayout } from '../components/ui';
import { type } from '../theme/tokens';

export function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { lang, setLang } = useSettings();
  const { colors } = useLayout();
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
        <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
          <Pressable
            onPress={() => void setLang(lang === 'ar' ? 'en' : 'ar')}
            accessibilityRole="button"
            accessibilityLabel={lang === 'ar' ? t('english') : t('arabic')}
            hitSlop={8}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <AppText tone="secondary" style={{ fontSize: type.label }}>
              {lang === 'ar' ? 'English' : 'العربية'}
            </AppText>
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', gap: 32, paddingBottom: 48 }}>
          <View style={{ gap: 8 }}>
            <AppText weight="semibold" style={{ fontSize: type.display }}>
              {t('appName')}
            </AppText>
            <AppText tone="muted" style={{ fontSize: type.body }}>
              {t('appTagline')}
            </AppText>
          </View>

          <View style={{ gap: 16 }}>
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
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
