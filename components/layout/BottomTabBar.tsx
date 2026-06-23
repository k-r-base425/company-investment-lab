import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

const tabs = [
  { id: "home", label: "ホーム", icon: "H", href: "/" },
  { id: "accounting", label: "会計", icon: "A", href: "/accounting" },
  { id: "investment", label: "投資", icon: "I", href: "/investment" },
  { id: "learning", label: "学習", icon: "L", href: "/learning" },
  { id: "settings", label: "設定", icon: "S" }
] as const;

type BottomTabId = (typeof tabs)[number]["id"];

type BottomTabBarProps = {
  activeTab?: BottomTabId;
};

export function BottomTabBar({ activeTab = "home" }: BottomTabBarProps) {
  const router = useRouter();

  return (
    <View pointerEvents="box-none" style={styles.shell}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Pressable
              accessibilityRole="button"
              key={tab.id}
              onPress={() => {
                if ("href" in tab) {
                  router.push(tab.href);
                  return;
                }

                console.log(`Open ${tab.id} tab`);
              }}
              style={({ pressed }) => [styles.tab, active && styles.tabActive, pressed && styles.tabPressed]}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Text style={[styles.iconText, active && styles.iconTextActive]}>{tab.icon}</Text>
              </View>
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: "center",
    bottom: 0,
    left: 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: "absolute",
    right: 0
  },
  bar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E2F0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: 430,
    minHeight: 68,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 5,
    width: "100%"
  },
  tab: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
    minWidth: 0,
    paddingHorizontal: 2,
    paddingVertical: 4
  },
  tabActive: {
    backgroundColor: "#EFF6FF"
  },
  tabPressed: {
    opacity: 0.78
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  iconWrapActive: {
    backgroundColor: "#2563EB"
  },
  iconText: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "900"
  },
  iconTextActive: {
    color: "#FFFFFF"
  },
  label: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 4,
    maxWidth: "100%"
  },
  labelActive: {
    color: "#1D4ED8"
  }
});
