import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CollapsibleSectionProps = {
  title: string;
  subtitle?: string;
  badgeText?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CollapsibleSection({
  title,
  subtitle,
  badgeText,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) {
  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={onToggle}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {badgeText ? <Text style={styles.badge}>{badgeText}</Text> : null}
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Text style={styles.toggleIcon}>{isOpen ? "-" : "+"}</Text>
      </Pressable>

      {isOpen ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    overflow: "hidden",
    width: "100%"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  headerPressed: {
    backgroundColor: "#F8FAFC"
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minWidth: 0
  },
  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 24
  },
  badge: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 999,
    borderWidth: 1,
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 16,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  subtitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  },
  toggleIcon: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
    borderRadius: 999,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    minWidth: 28,
    overflow: "hidden",
    paddingVertical: 2,
    textAlign: "center"
  },
  body: {
    borderTopColor: "#E2E8F0",
    borderTopWidth: 1,
    paddingBottom: 14,
    paddingHorizontal: 14
  }
});
