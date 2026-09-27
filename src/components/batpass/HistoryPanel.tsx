import { StyleSheet, Text, View } from 'react-native';

import { formatRelativeTime, HISTORY_LIMIT, maskPassword, type HistoryEntry } from '../../domain/history.ts';
import { useNow } from '../../hooks/useNow';
import { colors, fonts, radii } from '../../theme/tokens';
import { BatGlyph } from '../ui/BatGlyph';
import { CheckIcon, CopyIcon, TrashIcon } from '../ui/Icons';
import { PressableScale } from '../ui/PressableScale';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  ready: boolean;
  copiedKey: string | null;
  onCopy: (entry: HistoryEntry) => void;
  onClear: () => void;
}

interface HistoryRowProps {
  entry: HistoryEntry;
  now: number;
  copied: boolean;
  onCopy: () => void;
}

const CLOCK_TICK = 30_000;

function HistoryRow({ entry, now, copied, onCopy }: HistoryRowProps) {
  const when = formatRelativeTime(entry.createdAt, now);

  return (
    <PressableScale
      onPress={onCopy}
      pressedScale={0.985}
      focusRadius={radii.control + 4}
      accessibilityRole="button"
      accessibilityLabel={`Copiar senha de ${Math.round(entry.bits)} bits, ${when}`}
      style={({ hovered }) => [styles.row, hovered && styles.rowHover]}
    >
      {({ hovered }) => (
        <>
          <View style={styles.rowCopy}>
            <Text style={styles.masked} numberOfLines={1}>
              {maskPassword(entry.password)}
            </Text>
            <Text style={styles.meta}>
              {Math.round(entry.bits)} bits · {entry.password.length} car. · {when}
            </Text>
          </View>
          <View style={[styles.rowIcon, (hovered || copied) && styles.rowIconActive]}>
            {copied ? <CheckIcon color={colors.onAmber} size={16} /> : <CopyIcon color={hovered ? colors.onAmber : colors.muted} size={16} />}
          </View>
        </>
      )}
    </PressableScale>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyBadge}>
        <BatGlyph size={36} color={colors.dim} />
      </View>
      <Text style={styles.emptyTitle}>Cofre vazio</Text>
      <Text style={styles.emptyText}>Copie uma senha e ela aparece aqui, mascarada e guardada só neste aparelho.</Text>
    </View>
  );
}

function Skeleton() {
  return (
    <View style={styles.list}>
      {[0, 1, 2].map((key) => (
        <View key={key} style={styles.skeleton} />
      ))}
    </View>
  );
}

export function HistoryPanel({ entries, ready, copiedKey, onCopy, onClear }: HistoryPanelProps) {
  const now = useNow(CLOCK_TICK);
  const hasEntries = entries.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>{hasEntries ? `${entries.length} de ${HISTORY_LIMIT} · só neste aparelho` : 'Guardado só neste aparelho'}</Text>
        </View>
        {hasEntries && (
          <PressableScale
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Limpar histórico"
            style={({ hovered }) => [styles.clear, hovered && styles.clearHover]}
          >
            {({ hovered }) => (
              <>
                <TrashIcon color={hovered ? colors.alert : colors.muted} size={15} />
                <Text style={[styles.clearText, hovered && styles.clearTextHover]}>Limpar</Text>
              </>
            )}
          </PressableScale>
        )}
      </View>
      {!ready && <Skeleton />}
      {ready && !hasEntries && <EmptyState />}
      {ready && hasEntries && (
        <View style={styles.list}>
          {entries.map((entry) => (
            <HistoryRow key={entry.id} entry={entry} now={now} copied={copiedKey === entry.id} onCopy={() => onCopy(entry)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  clear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  clearHover: {
    backgroundColor: 'rgba(255,91,74,0.1)',
  },
  clearText: {
    fontFamily: fonts.label,
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  clearTextHover: {
    color: colors.alert,
  },
  list: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: radii.control,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  rowHover: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: colors.hairlineStrong,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  masked: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.text,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.dim,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rowIconActive: {
    backgroundColor: colors.amber,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 34,
    paddingHorizontal: 24,
    borderRadius: radii.control,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.hairlineStrong,
  },
  emptyBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.hairline,
    marginBottom: 6,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.text,
  },
  emptyText: {
    maxWidth: 300,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 21,
    color: colors.muted,
  },
  skeleton: {
    height: 64,
    borderRadius: radii.control,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
});
