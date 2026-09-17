import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";

import { ScreenContainer } from "@/components/screen-container";

const colors = {
  ink: "#141414",
  muted: "#6B6B6B",
  soft: "#F5F5F5",
  line: "#E6E6E6",
  white: "#FFFFFF",
  yellow: "#FFC300",
  orange: "#E85D04",
  red: "#D32F2F",
  blue: "#1E88E5",
  green: "#43A047",
};
const alerts = [
  {
    id: "PRT-0231",
    title: "Prazo aduaneiro se aproximando",
    description: "Suporte frontal — protótipo X52",
    days: 42,
    level: "Atenção",
    dock: "Doca B",
    dockColor: colors.blue,
  },
  {
    id: "PRT-0217",
    title: "Prioridade crítica",
    description: "Módulo de iluminação — protótipo X52",
    days: 17,
    level: "Crítico",
    dock: "Doca A",
    dockColor: colors.red,
  },
  {
    id: "PRT-0204",
    title: "Prazo aduaneiro se aproximando",
    description: "Conjunto de acabamento — protótipo HJD",
    days: 31,
    level: "Atenção",
    dock: "Doca C",
    dockColor: colors.green,
  },
  {
    id: "PRT-0198",
    title: "Acompanhar destruição",
    description: "Balança estrutural — protótipo X52",
    days: 6,
    level: "Crítico",
    dock: "Doca B",
    dockColor: colors.blue,
  },
];

function Icon({
  name,
  size = 22,
  color = colors.ink,
}: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color?: string;
}) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

export default function AlertsScreen() {
  const openPiece = useCallback(
    () => router.push({ pathname: "/", params: { focus: "piece" } }),
    [],
  );
  return (
    <ScreenContainer containerClassName="bg-[#F5F5F5]" className="px-5">
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>MONITORAMENTO</Text>
          <Text style={styles.title}>Alertas ativos</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{alerts.length}</Text>
        </View>
      </View>
      <View style={styles.summary}>
        <View style={styles.summaryIcon}>
          <Icon name="warning-amber" size={20} color={colors.orange} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryTitle}>
            Priorize os prazos mais curtos
          </Text>
          <Text style={styles.summaryText}>
            As peças são ordenadas pelo tempo restante no Brasil.
          </Text>
        </View>
      </View>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={openPiece}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View
              style={[
                styles.levelBar,
                {
                  backgroundColor:
                    item.level === "Crítico" ? colors.red : colors.orange,
                },
              ]}
            />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.code}>{item.id}</Text>
                <View
                  style={[
                    styles.levelPill,
                    {
                      backgroundColor:
                        item.level === "Crítico" ? "#FDECEC" : "#FFF2E8",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelText,
                      {
                        color:
                          item.level === "Crítico" ? colors.red : colors.orange,
                      },
                    ]}
                  >
                    {item.level}
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.dockTag}>
                  <View
                    style={[styles.dot, { backgroundColor: item.dockColor }]}
                  />
                  <Text style={[styles.dockText, { color: item.dockColor }]}>
                    {item.dock}
                  </Text>
                </View>
                <View style={styles.days}>
                  <Text
                    style={[
                      styles.daysNumber,
                      { color: item.days <= 20 ? colors.red : colors.orange },
                    ]}
                  >
                    {item.days}
                  </Text>
                  <Text style={styles.daysLabel}>dias restantes</Text>
                </View>
                <Icon name="chevron-right" size={21} color={colors.muted} />
              </View>
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 22,
    paddingBottom: 20,
  },
  kicker: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  title: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  countBadge: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  countText: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 18,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF2E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  summaryTitle: { color: colors.ink, fontSize: 12, fontWeight: "900" },
  summaryText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  list: { paddingBottom: 30, gap: 11 },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  levelBar: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  code: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  levelPill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7 },
  levelText: { fontSize: 9, fontWeight: "900" },
  description: { color: colors.muted, fontSize: 11, marginTop: 5 },
  cardBottom: { flexDirection: "row", alignItems: "center", marginTop: 17 },
  dockTag: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dockText: { fontSize: 10, fontWeight: "900" },
  days: {
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 11,
    gap: 4,
  },
  daysNumber: { fontSize: 19, fontWeight: "900" },
  daysLabel: { color: colors.muted, fontSize: 9 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
});
