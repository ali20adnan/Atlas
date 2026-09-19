import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Flashlight, FlashlightOff, Keyboard as KeyboardIcon } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Linking, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { findByCode } from '../data/catalog';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { AppText, Button, Field, useLayout } from '../components/ui';
import { radius, type } from '../theme/tokens';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'ScanTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const fill = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

export function ScanScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useLayout();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState('');
  const [miss, setMiss] = useState<string | null>(null);
  const [active, setActive] = useState(true);
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

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#020617' }} />;

  const cameraReady = permission.granted && Platform.OS !== 'web';

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      {cameraReady && active ? (
        <CameraView
          style={fill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e', 'codabar', 'pdf417', 'itf14'],
          }}
          onBarcodeScanned={({ data }) => void lookup(data)}
        />
      ) : (
        <View style={fill} />
      )}

      <View pointerEvents="box-none" style={[fill, { paddingTop: insets.top + 8 }]}>
        <View style={{ alignItems: 'center', paddingTop: 12 }}>
          <View
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              borderRadius: radius.full,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: 'rgba(248,250,252,0.14)',
            }}
          >
            <AppText style={{ color: '#F8FAFC', fontSize: type.label }}>{t('scanHint')}</AppText>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Viewfinder />
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }}>
          {!permission.granted ? (
            <View style={{ gap: 12, paddingBottom: 8 }}>
              <AppText style={{ color: '#F8FAFC', fontSize: type.body }}>{t('scanPermissionBody')}</AppText>
              <Button
                label={permission.canAskAgain ? t('allowCamera') : t('openSettings')}
                onPress={() => {
                  if (permission.canAskAgain) void requestPermission();
                  else void Linking.openSettings();
                }}
              />
            </View>
          ) : null}

          {miss ? (
            <Pressable
              onPress={() => {
                const q = miss;
                setMiss(null);
                navigation.navigate('Search', { q });
              }}
              accessibilityRole="button"
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: radius.lg,
                backgroundColor: 'rgba(15, 23, 42, 0.62)',
              }}
            >
              <AppText style={{ color: '#F8FAFC', fontSize: type.body }}>{t('notFoundTitle')}</AppText>
              <AppText style={{ color: 'rgba(248,250,252,0.6)', fontSize: type.label, marginTop: 4 }}>
                {miss}
              </AppText>
            </Pressable>
          ) : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {cameraReady ? (
              <GlassBtn label={torch ? t('torchOff') : t('torchOn')} onPress={() => setTorch((v) => !v)}>
                {torch ? (
                  <FlashlightOff size={22} color="#F8FAFC" strokeWidth={1.75} />
                ) : (
                  <Flashlight size={22} color="#F8FAFC" strokeWidth={1.75} />
                )}
              </GlassBtn>
            ) : (
              <View style={{ width: 52 }} />
            )}
            <GlassBtn
              label={t('enterManually')}
              onPress={() => {
                setManual(true);
                setMiss(null);
              }}
            >
              <KeyboardIcon size={22} color="#F8FAFC" strokeWidth={1.75} />
            </GlassBtn>
          </View>
        </View>
      </View>

      <Modal visible={manual} animationType="slide" transparent onRequestClose={() => setManual(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setManual(false)} />
          <View
            style={{
              backgroundColor: colors.surface,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Math.max(insets.bottom, 20),
              gap: 16,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: radius.full,
                backgroundColor: colors.border,
                marginBottom: 8,
              }}
            />
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
  const arm = 26;
  const thick = 3;
  const color = '#34D399';
  return (
    <View style={{ width: 240, height: 240 }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: arm,
          height: arm,
          borderTopWidth: thick,
          borderLeftWidth: thick,
          borderColor: color,
          borderTopLeftRadius: 16,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: arm,
          height: arm,
          borderTopWidth: thick,
          borderRightWidth: thick,
          borderColor: color,
          borderTopRightRadius: 16,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: arm,
          height: arm,
          borderBottomWidth: thick,
          borderLeftWidth: thick,
          borderColor: color,
          borderBottomLeftRadius: 16,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: arm,
          height: arm,
          borderBottomWidth: thick,
          borderRightWidth: thick,
          borderColor: color,
          borderBottomRightRadius: 16,
        }}
      />
    </View>
  );
}

function GlassBtn({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(15, 23, 42, 0.58)',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(248,250,252,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
