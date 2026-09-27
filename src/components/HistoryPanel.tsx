import { StyleSheet, Text, View } from "react-native";
import { formatRelativeTime, HISTORY_LIMIT, maskPassword, type HistoryEntry } from "../domain/history.ts";
import { useNow } from "../hooks/useNow.ts";
import { BatGlyph, CheckIcon, CopyIcon, TrashIcon } from "./Icons.tsx";
import { PressableScale } from "./PressableScale.tsx";
import { colors, fonts, radii } from "../theme/tokens.ts";

interface Props {
  entries: HistoryEntry[];
  ready: boolean;
  copiedKey: string | null;
  onCopy: (entry: HistoryEntry) => void;
  onClear: () => void;
}

function HistoryRow({ entry, now, copied, onCopy }: { entry: HistoryEntry; now: number; copied: boolean; onCopy: () => void }) {
  return (
    <PressableScale
      onPress={onCopy}
      pressedScale={0.985}
      focusRadius={radii.control + 4}
      accessibilityRole="button"
      accessibilityLabel={`Copiar senha de ${Math.round(entry.bits)} bits, ${formatRelativeTime(entry.createdAt, now)}`}
      style={({ hovered }) => [styles.row, hovered && styles.rowHover]}
    >
      {({ hovered }) => (
        <>
          <View style={styles.rowCopy}>
            <Text style={styles.masked} numberOfLines={1}>
              {maskPassword(entry.password)}
            </Text>
            <Text style={styles.meta}>
              {Math.round(entry.bits)} bits · {entry.password.length} caracteres · {formatRelativeTime(entry.createdAt, now)}
            </Text>
          </View>
          <View style={[styles.rowIcon, (hovered || copied) && styles.rowIconActive]}>
            {copied ? <CheckIcon color={colors.ink} size={16} /> : <CopyIcon color={hovered ? colors.ink : colors.textMuted} size={16} />}
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
        <BatGlyph size={34} color={colors.textFaint} />
      </View>
      <Text style={styles.emptyTitle}>Cofre vazio</Text>
      <Text style={styles.emptyText}>
        Copie uma senha e ela aparece aqui, mascarada e guardada só neste aparelho.
      </Text>
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

export function HistoryPanel({ entries, ready, copiedKey, onCopy, onClear }: Props) {
  const now = useNow();
  const hasEntries = entries.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>
            {hasEntries ? `${entries.length} de ${HISTORY_LIMIT} · só neste aparelho` : "Guardado só neste aparelho"}
          </Text>
        </View>
        {hasEntries ? (
          <PressableScale
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Limpar histórico"
            style={({ hovered }) => [styles.clear, hovered && styles.clearHover]}
          >
            {({ hovered }) => (
              <>
                <TrashIcon color={hovered ? "#FF8A7F" : colors.textMuted} size={15} />
                <Text style={[styles.clearText, hovered && styles.clearTextHover]}>Limpar</Text>
              </>
            )}
          </PressableScale>
        ) : null}
      </View>
      {!ready ? <Skeleton /> : null}
      {ready && !hasEntries ? <EmptyState /> : null}
      {ready && hasEntries ? (
        <View style={styles.list}>
          {entries.map((entry) => (
            <HistoryRow
              key={entry.id}
              entry={entry}
              now={now}
              copied={copiedKey === entry.id}
              onCopy={() => onCopy(entry)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.textMuted,
  },
  clear: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  clearHover: {
    backgroundColor: "rgba(255,107,94,0.1)",
  },
  clearText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
  },
  clearTextHover: {
    color: "#FF8A7F",
  },
  list: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 10,
    borderRadius: radii.control,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  rowHover: {
    backgroundColor: "rgba(255,255,255,0.05)",
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
    fontSize: 12,
    color: colors.textFaint,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  rowIconActive: {
    backgroundColor: colors.signal,
  },
  empty: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderRadius: radii.control,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.hairlineStrong,
  },
  emptyBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.text,
  },
  emptyText: {
    maxWidth: 300,
    textAlign: "center",
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textMuted,
  },
  skeleton: {
    height: 62,
    borderRadius: radii.control,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
});
