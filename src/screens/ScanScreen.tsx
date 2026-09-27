import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Flashlight, FlashlightOff, Keyboard as KeyboardIcon, ScanLine } from 'lucide-react-native';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Linking, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { findByCode } from '../data/catalog';
import { tabBarChrome } from '../navigation/tabBarChrome';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { AppText, Button, Field, Kicker, Screen, useLayout } from '../components/ui';
import { elevation, radius, type } from '../theme/tokens';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'ScanTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const fill = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };
const CHROME = 'rgba(5, 8, 7, 0.78)';
const CHROME_LINE = 'rgba(243, 247, 245, 0.16)';
const GOLD = '#D8BC80';

export function ScanScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors, fonts, row } = useLayout();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState('');
  const [miss, setMiss] = useState<string | null>(null);
  const [active, setActive] = useState(true);
  const [cameraFailed, setCameraFailed] = useState(false);
  const lock = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setActive(true);
      lock.current = false;
      setMiss(null);
      return () => setActive(false);
    }, []),
  );

  const lookup = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      if (!value || lock.current) return;
      lock.current = true;
      const item = findByCode(value);
      try {
        await Haptics.notificationAsync(
          item ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
        );
      } catch {
        /* web */
      }
      if (item) {
        setManual(false);
        setMiss(null);
        navigation.navigate('ItemDetail', { id: item.id, scanned: true });
        setTimeout(() => {
          lock.current = false;
        }, 800);
      } else {
        setMiss(value);
        lock.current = false;
      }
    },
    [navigation],
  );

  const showCamera = !!permission?.granted && Platform.OS !== 'web' && Constants.isDevice === true && !cameraFailed;

  useLayoutEffect(() => {
    navigation.setOptions(tabBarChrome(colors, insets.bottom, showCamera));
  }, [colors, insets.bottom, navigation, showCamera]);

  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const openManual = () => {
    setManual(true);
    setMiss(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: showCamera ? '#070B09' : colors.bg }}>
      {showCamera && active ? (
        <CameraView
          style={fill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e', 'codabar', 'pdf417', 'itf14'],
          }}
          onBarcodeScanned={({ data }) => void lookup(data)}
          onMountError={() => setCameraFailed(true)}
        />
      ) : null}

      {showCamera ? (
        <View pointerEvents="box-none" style={[fill, { paddingTop: insets.top + 12 }]}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(5, 8, 7, 0.72)', 'rgba(5, 8, 7, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160 }}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(5, 8, 7, 0)', 'rgba(5, 8, 7, 0.82)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 }}
          />

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: CHROME,
                borderRadius: radius.full,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: CHROME_LINE,
                paddingHorizontal: 16,
                paddingVertical: 9,
              }}
            >
              <Text style={{ color: '#F3F7F5', fontFamily: fonts.medium, fontSize: type.label }}>{t('scanHint')}</Text>
            </View>
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Viewfinder />
          </View>

          <View style={{ paddingHorizontal: 20, paddingBottom: 16, gap: 10 }}>
            {miss ? <MissNote code={miss} onPress={() => navigation.navigate('Search', { q: miss })} /> : null}
            <View style={{ flexDirection: row, gap: 10 }}>
              <CamAction label={torch ? t('torchOff') : t('torchOn')} onPress={() => setTorch((v) => !v)} fonts={fonts}>
                {torch ? (
                  <FlashlightOff size={18} color={GOLD} strokeWidth={1.75} />
                ) : (
                  <Flashlight size={18} color="#F3F7F5" strokeWidth={1.75} />
                )}
              </CamAction>
              <CamAction label={t('enterManually')} onPress={openManual} fonts={fonts}>
                <KeyboardIcon size={18} color="#F3F7F5" strokeWidth={1.75} />
              </CamAction>
            </View>
          </View>
        </View>
      ) : (
        <Screen>
          <View style={{ flex: 1, gap: 16, paddingTop: 28 }}>
            <LinearGradient
              colors={colors.accentGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                ...elevation.cta(colors),
              }}
            >
              <ScanLine size={26} color="#F5E9CE" strokeWidth={1.75} />
            </LinearGradient>
            <Kicker tone="muted">{t('scan')}</Kicker>
            <AppText weight="bold" style={{ fontSize: type.display, lineHeight: 46 }}>
              {permission.granted ? t('cameraUnavailableTitle') : t('scanPermissionTitle')}
            </AppText>
            <AppText tone="secondary" style={{ fontSize: type.body, lineHeight: 24, maxWidth: 320 }}>
              {permission.granted ? t('cameraUnavailableBody') : t('scanPermissionBody')}
            </AppText>
            <View style={{ marginTop: 12, gap: 10 }}>
              {!permission.granted ? (
                <Button
                  label={permission.canAskAgain ? t('allowCamera') : t('openSettings')}
                  onPress={() => {
                    if (permission.canAskAgain) void requestPermission();
                    else void Linking.openSettings();
                  }}
                />
              ) : null}
              <Button label={t('enterManually')} variant={permission.granted ? 'primary' : 'secondary'} onPress={openManual} />
            </View>
            {miss ? (
              <Pressable onPress={() => navigation.navigate('Search', { q: miss })} accessibilityRole="button">
                <AppText tone="danger" weight="medium" style={{ fontSize: type.body }}>
                  {t('notFoundTitle')} · {miss}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </Screen>
      )}

      <Modal visible={manual} animationType="slide" transparent onRequestClose={() => setManual(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay }}>
          <Pressable style={{ flex: 1 }} onPress={() => setManual(false)} accessibilityLabel={t('back')} />
          <View
            style={{
              backgroundColor: colors.surface,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom, 20),
              gap: 16,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              ...elevation.float(colors),
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: radius.full,
                backgroundColor: colors.border,
              }}
            />
            <View style={{ gap: 6 }}>
              <Kicker tone="muted">{t('scan')}</Kicker>
              <AppText weight="bold" style={{ fontSize: type.title }}>
                {t('manualTitle')}
              </AppText>
            </View>
            <Field
              label={t('barcode')}
              value={code}
              onChangeText={setCode}
              placeholder={t('manualPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => void lookup(code)}
            />
            <Button label={t('lookup')} onPress={() => void lookup(code)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Viewfinder() {
  const arm = 30;
  const thick = 3.5;
  const corner = (position: object) => (
    <View
      style={{
        position: 'absolute',
        width: arm,
        height: arm,
        borderColor: GOLD,
        shadowColor: GOLD,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity: 0.55,
        ...position,
      }}
    />
  );
  return (
    <View style={{ width: 236, height: 236 }}>
      {corner({ top: 0, left: 0, borderTopWidth: thick, borderLeftWidth: thick, borderTopLeftRadius: 6 })}
      {corner({ top: 0, right: 0, borderTopWidth: thick, borderRightWidth: thick, borderTopRightRadius: 6 })}
      {corner({ bottom: 0, left: 0, borderBottomWidth: thick, borderLeftWidth: thick, borderBottomLeftRadius: 6 })}
      {corner({ bottom: 0, right: 0, borderBottomWidth: thick, borderRightWidth: thick, borderBottomRightRadius: 6 })}
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginLeft: -2,
          marginTop: -2,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(216, 188, 128, 0.6)',
        }}
      />
    </View>
  );
}

function CamAction({
  label,
  onPress,
  fonts,
  children,
}: {
  label: string;
  onPress: () => void;
  fonts: { medium: string };
  children: React.ReactNode;
}) {
  const { row } = useLayout();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 54,
        borderRadius: radius.full,
        backgroundColor: pressed ? 'rgba(5, 8, 7, 0.92)' : CHROME,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: CHROME_LINE,
        flexDirection: row,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 12,
      })}
    >
      {children}
      <Text style={{ color: '#F3F7F5', fontFamily: fonts.medium, fontSize: type.label }} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function MissNote({ code, onPress }: { code: string; onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: radius.lg,
        backgroundColor: CHROME,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(240, 146, 135, 0.4)',
        gap: 2,
      }}
    >
      <Text style={{ color: '#F3F7F5', fontSize: type.body }}>{t('notFoundTitle')}</Text>
      <Text style={{ color: 'rgba(243, 247, 245, 0.72)', fontSize: type.label }}>{code}</Text>
    </Pressable>
  );
}
