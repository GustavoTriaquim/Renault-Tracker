import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";

import { ScreenContainer } from "@/components/screen-container";

const COLORS = {
  ink: "#141414",
  muted: "#6B6B6B",
  soft: "#F5F5F5",
  line: "#E6E6E6",
  white: "#FFFFFF",
  yellow: "#FFC300",
  yellowDark: "#D9A600",
  red: "#E53935",
  blue: "#1E88E5",
  green: "#43A047",
  orange: "#E85D04",
  critical: "#D32F2F",
  success: "#1B7F3A",
  navy: "#1C2633",
};

const operator = { name: "Camila Oliveira", registration: "MAT 04827", dock: "Doca B" };
const piece = {
  id: "PRT-0231",
  description: "Suporte frontal — protótipo X52",
  dock: "Doca B",
  dockColor: COLORS.blue,
  stage: "Triagem",
  daysRemaining: 42,
};

type ScreenView = "home" | "scan" | "detail" | "justify" | "photos" | "success";
type ActionType = "Devolver" | "Cancelar" | "Avançar" | "Evidências";

function tapFeedback() {
  if (Platform.OS !== "web") {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function Icon({ name, size = 22, color = COLORS.ink }: { name: React.ComponentProps<typeof MaterialIcons>["name"]; size?: number; color?: string }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.headerBack} accessibilityLabel="Voltar">
          <Icon name="arrow-back" size={23} />
        </Pressable>
      ) : (
        <View style={styles.headerBack} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerBack} />
    </View>
  );
}

function DockTag({ label = piece.dock, color = piece.dockColor }: { label?: string; color?: string }) {
  return (
    <View style={[styles.dockTag, { backgroundColor: `${color}16`, borderColor: `${color}55` }]}>
      <View style={[styles.dockDot, { backgroundColor: color }]} />
      <Text style={[styles.dockTagText, { color }]}>{label}</Text>
    </View>
  );
}

function PrimaryButton({ label, icon, onPress, disabled = false }: { label: string; icon?: React.ComponentProps<typeof MaterialIcons>["name"]; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          tapFeedback();
          onPress();
        }
      }}
      disabled={disabled}
      style={({ pressed }) => [styles.primaryButton, disabled && styles.disabledButton, pressed && !disabled && styles.pressed]}
    >
      {icon ? <Icon name={icon} size={22} color={COLORS.ink} /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function OutlineButton({ label, icon, onPress, danger = false }: { label: string; icon?: React.ComponentProps<typeof MaterialIcons>["name"]; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={() => { tapFeedback(); onPress(); }} style={({ pressed }) => [styles.outlineButton, danger && styles.dangerButton, pressed && styles.pressed]}>
      {icon ? <Icon name={icon} size={21} color={danger ? COLORS.critical : COLORS.ink} /> : null}
      <Text style={[styles.outlineButtonText, danger && styles.dangerButtonText]}>{label}</Text>
    </Pressable>
  );
}

function HomeView({ onScan, onOpenAlert, onOpenPiece }: { onScan: () => void; onOpenAlert: () => void; onOpenPiece: () => void }) {
  return (
    <ScreenContainer containerClassName="bg-[#F5F5F5]" className="px-5">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeContent}>
        <View style={styles.brandRow}>
          <View style={styles.renaultMark}>
            <Text style={styles.renaultMarkText}>R</Text>
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandName}>RENAULT</Text>
            <Text style={styles.brandProduct}>TRACE / MOBILE</Text>
          </View>
          <Pressable onPress={() => Alert.alert("Sessão operacional", "Matrícula vinculada ao turno atual.")} style={styles.iconButton}>
            <Icon name="person-outline" size={22} />
          </Pressable>
        </View>

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.eyebrow}>BOM DIA, CAMILA</Text>
            <Text style={styles.pageTitle}>Operação em foco.</Text>
          </View>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>ONLINE</Text>
          </View>
        </View>

        <View style={styles.operatorCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>CO</Text></View>
          <View style={styles.operatorCopy}>
            <Text style={styles.operatorName}>{operator.name}</Text>
            <Text style={styles.operatorMeta}>{operator.registration}  •  Turno 1</Text>
          </View>
          <View style={styles.operatorDock}>
            <Text style={styles.smallLabel}>ORIGEM</Text>
            <Text style={styles.operatorDockText}>{operator.dock}</Text>
          </View>
        </View>

        <PrimaryButton label="Escanear peça" icon="qr-code-scanner" onPress={onScan} />
        <Text style={styles.scanHint}>Leia o código da etiqueta para registrar a próxima movimentação</Text>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Atenção necessária</Text>
          <Pressable onPress={onOpenAlert} style={styles.seeAll}><Text style={styles.seeAllText}>Ver alertas</Text><Icon name="arrow-forward" size={16} color={COLORS.critical} /></Pressable>
        </View>
        <Pressable onPress={() => { tapFeedback(); onOpenPiece(); }} style={({ pressed }) => [styles.alertCard, pressed && styles.pressed]}>
          <View style={styles.alertIcon}><Icon name="schedule" size={22} color={COLORS.critical} /></View>
          <View style={styles.alertCopy}>
            <Text style={styles.alertTitle}>Prazo aduaneiro se aproximando</Text>
            <Text style={styles.alertDescription}>{piece.id} precisa chegar à destruição documentada.</Text>
            <View style={styles.alertBottom}><Text style={styles.criticalText}>{piece.daysRemaining} dias restantes</Text><Text style={styles.alertAction}>ABRIR <Icon name="chevron-right" size={15} color={COLORS.critical} /></Text></View>
          </View>
        </Pressable>

        <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Resumo do turno</Text><Text style={styles.mutedCaption}>HOJE, 17 SET</Text></View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>18</Text><Text style={styles.statLabel}>movimentadas</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: COLORS.orange }]}>03</Text><Text style={styles.statLabel}>em atenção</Text></View>
          <View style={styles.statCard}><Text style={[styles.statValue, { color: COLORS.success }]}>100%</Text><Text style={styles.statLabel}>sincronizado</Text></View>
        </View>

        <View style={styles.lastMovement}>
          <View style={styles.lastIcon}><Icon name="check" size={18} color={COLORS.success} /></View>
          <View style={{ flex: 1 }}><Text style={styles.lastTitle}>Última movimentação registrada</Text><Text style={styles.lastMeta}>PRT-0229  •  Recebimento → Triagem  •  09:42</Text></View>
          <Icon name="chevron-right" size={20} color={COLORS.muted} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function ScanView({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#141414]" className="px-5">
      <StatusBar style="light" />
      <View style={styles.scanScreen}>
        <View style={styles.scanTop}><Pressable onPress={onBack} style={styles.scanClose}><Icon name="close" size={25} color={COLORS.white} /></Pressable><View style={styles.scanMode}><View style={styles.scanModeDot} /><Text style={styles.scanModeText}>LEITOR OCR</Text></View><Pressable onPress={() => Alert.alert("Ajuda", "Posicione o código dentro da moldura e mantenha o celular estável.")}><Icon name="help-outline" size={24} color={COLORS.white} /></Pressable></View>
        <View style={styles.scanCenter}>
          <Text style={styles.scanTitle}>Escanear peça</Text>
          <Text style={styles.scanSubtitle}>Posicione o código dentro da moldura</Text>
          <View style={styles.scanFrame}><View style={[styles.corner, styles.cornerTL]} /><View style={[styles.corner, styles.cornerTR]} /><View style={[styles.corner, styles.cornerBL]} /><View style={[styles.corner, styles.cornerBR]} /><View style={styles.scanLine} /><View style={styles.recognized}><Icon name="check-circle" size={18} color={COLORS.success} /><Text style={styles.recognizedText}>Código reconhecido</Text></View></View>
          <View style={styles.scanResult}><Text style={styles.scanResultLabel}>LEITURA ATUAL</Text><Text style={styles.scanResultCode}>{piece.id}</Text><Text style={styles.scanResultDesc}>{piece.description}</Text></View>
        </View>
        <View style={styles.scanBottom}><Text style={styles.scanBottomHint}>Demonstração pronta para conectar ao OCR / leitor de código</Text><PrimaryButton label="Confirmar leitura" icon="done" onPress={onConfirm} /><Pressable onPress={() => Alert.alert("Nova leitura", "A câmera está pronta para uma nova tentativa.")} style={styles.retry}><Icon name="refresh" size={17} color={COLORS.white} /><Text style={styles.retryText}>Tentar novamente</Text></Pressable></View>
      </View>
    </ScreenContainer>
  );
}

function Stepper() {
  return (
    <View style={styles.stepper}>
      <View style={styles.stepItem}><View style={styles.stepCircleDone}><Icon name="check" size={13} color={COLORS.white} /></View><Text style={styles.stepLabelDone}>Recebimento</Text></View>
      <View style={styles.stepLineDone} />
      <View style={styles.stepItem}><View style={styles.stepCircleCurrent}><Text style={styles.stepCircleText}>2</Text></View><Text style={styles.stepLabelCurrent}>Triagem</Text></View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}><View style={styles.stepCircle}><Text style={styles.stepCircleMuted}>3</Text></View><Text style={styles.stepLabel}>Teste</Text></View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}><View style={styles.stepCircle}><Text style={styles.stepCircleMuted}>4</Text></View><Text style={styles.stepLabel}>Destruição</Text></View>
    </View>
  );
}

function DetailView({ onBack, onAdvance, onJustify, onPhotos }: { onBack: () => void; onAdvance: () => void; onJustify: (action: "Devolver" | "Cancelar") => void; onPhotos: () => void }) {
  return (
    <ScreenContainer containerClassName="bg-[#F5F5F5]" className="px-5">
      <StatusBar style="dark" />
      <Header title="Detalhe da peça" onBack={onBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent}>
        <View style={styles.detailHero}><View style={styles.detailIcon}><Icon name="qr-code-2" size={27} color={COLORS.ink} /></View><View style={{ flex: 1 }}><Text style={styles.detailCode}>{piece.id}</Text><Text style={styles.detailDescription}>{piece.description}</Text></View><DockTag /></View>
        <View style={styles.statusStrip}><View style={styles.statusDot} /><Text style={styles.statusStripText}>EM FLUXO  •  {piece.stage.toUpperCase()}</Text><Text style={styles.statusDays}>{piece.daysRemaining}d</Text></View>
        <View style={styles.block}><View style={styles.blockHeader}><Text style={styles.blockTitle}>Linha do processo</Text><Text style={styles.blockMeta}>ATUALIZADO AGORA</Text></View><Stepper /></View>
        <View style={styles.block}><View style={styles.blockHeader}><Text style={styles.blockTitle}>Evidências</Text><Text style={styles.blockMeta}>0 FOTOS</Text></View><Pressable onPress={onPhotos} style={({ pressed }) => [styles.evidenceRow, pressed && styles.pressed]}><View style={styles.evidenceIcon}><Icon name="photo-camera" size={20} color={COLORS.muted} /></View><View style={{ flex: 1 }}><Text style={styles.evidenceTitle}>Adicionar foto da peça</Text><Text style={styles.evidenceDescription}>A foto fica vinculada ao dossiê e não vai para a galeria do aparelho.</Text></View><Icon name="add" size={22} color={COLORS.ink} /></Pressable></View>
        <View style={styles.actions}><Text style={styles.blockTitle}>Próxima ação</Text><PrimaryButton label="Avançar para Teste" icon="arrow-forward" onPress={onAdvance} /><View style={styles.actionPair}><OutlineButton label="Devolver" icon="undo" danger onPress={() => onJustify("Devolver")} /><OutlineButton label="Cancelar" icon="block" danger onPress={() => onJustify("Cancelar")} /></View></View>
        <Text style={styles.auditNote}>Toda ação registra automaticamente matrícula, data, hora e dispositivo.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function JustificationView({ action, reason, setReason, onBack, onSend }: { action: "Devolver" | "Cancelar"; reason: string; setReason: (value: string) => void; onBack: () => void; onSend: () => void }) {
  const chips = ["Danificada", "Inviável nos testes", "Outro"];
  const valid = reason.trim().length >= 12;
  return (
    <ScreenContainer containerClassName="bg-[#F5F5F5]" className="px-5">
      <StatusBar style="dark" />
      <Header title={`${action} peça`} onBack={onBack} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.justifyContent} keyboardShouldPersistTaps="handled">
          <View style={styles.warningHero}><View style={styles.warningIcon}><Icon name={action === "Cancelar" ? "block" : "undo"} size={24} color={COLORS.critical} /></View><View style={{ flex: 1 }}><Text style={styles.warningTitle}>{action} {piece.id}?</Text><Text style={styles.warningDescription}>Essa solicitação será encaminhada para validação da gestão do processo.</Text></View></View>
          <Text style={styles.formLabel}>Motivo rápido</Text>
          <View style={styles.chips}>{chips.map((chip) => <Pressable key={chip} onPress={() => { tapFeedback(); setReason(chip === "Outro" ? "" : `${chip}: `); }} style={[styles.chip, reason.startsWith(chip) && styles.chipSelected]}><Text style={[styles.chipText, reason.startsWith(chip) && styles.chipTextSelected]}>{chip}</Text></Pressable>)}</View>
          <Text style={styles.formLabel}>Justificativa <Text style={styles.required}>*</Text></Text>
          <TextInput value={reason} onChangeText={setReason} multiline placeholder="Descreva o que aconteceu com a peça..." placeholderTextColor="#9A9A9A" style={styles.justificationInput} textAlignVertical="top" maxLength={280} />
          <View style={styles.counterRow}><Text style={styles.minimumText}>{reason.trim().length < 12 ? "Mínimo de 12 caracteres" : "Justificativa pronta para envio"}</Text><Text style={styles.counter}>{reason.length}/280</Text></View>
          <View style={{ flex: 1, minHeight: 120 }} />
          <PrimaryButton label="Enviar para validação" icon="send" onPress={onSend} disabled={!valid} />
          <Text style={styles.validationNote}>A peça permanece nesta etapa até a aprovação da gestão.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function PhotosView({ count, onBack, onAdd, onFinish }: { count: number; onBack: () => void; onAdd: () => void; onFinish: () => void }) {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#141414]" className="px-5">
      <StatusBar style="light" />
      <View style={styles.photoScreen}><View style={styles.scanTop}><Pressable onPress={onBack} style={styles.scanClose}><Icon name="close" size={25} color={COLORS.white} /></Pressable><View style={styles.scanMode}><Text style={styles.scanModeText}>EVIDÊNCIAS  {count > 0 ? `• ${count}` : ""}</Text></View><Icon name="lock-outline" size={22} color={COLORS.white} /></View><View style={styles.photoCenter}><View style={styles.photoTarget}><Icon name="photo-camera" size={48} color="#8F8F8F" /><Text style={styles.photoTargetTitle}>Fotografe a peça</Text><Text style={styles.photoTargetHint}>A evidência será anexada ao dossiê de {piece.id}</Text></View></View><View style={styles.photoBottom}><View style={styles.thumbnails}><View style={styles.thumbnailLabel}><Text style={styles.thumbnailLabelText}>GALERIA DO PROCESSO</Text></View>{Array.from({ length: Math.max(count, 1) }).map((_, index) => index < count ? <View key={index} style={[styles.thumbnail, { backgroundColor: index % 2 === 0 ? "#3C4546" : "#5A4841" }]}><Text style={styles.thumbnailNumber}>{String(index + 1).padStart(2, "0")}</Text></View> : <Pressable key="add" onPress={onAdd} style={styles.addThumbnail}><Icon name="add" size={22} color={COLORS.white} /></Pressable>)}</View><PrimaryButton label={count > 0 ? "Concluir evidências" : "Tirar primeira foto"} icon={count > 0 ? "done" : "photo-camera"} onPress={count > 0 ? onFinish : onAdd} /><Pressable onPress={onFinish} style={styles.photoSkip}><Text style={styles.photoSkipText}>Concluir sem adicionar foto</Text></Pressable></View></View>
    </ScreenContainer>
  );
}

function SuccessView({ action, onNext, onHome }: { action: string; onNext: () => void; onHome: () => void }) {
  return (
    <ScreenContainer containerClassName="bg-[#F5F5F5]" className="px-5">
      <StatusBar style="dark" />
      <View style={styles.successScreen}><View style={styles.successMark}><Icon name="check" size={46} color={COLORS.white} /></View><Text style={styles.successKicker}>REGISTRO CONCLUÍDO</Text><Text style={styles.successTitle}>{action}</Text><Text style={styles.successDescription}>O evento foi vinculado à linha do tempo de {piece.id}.</Text><View style={styles.successCard}><View><Text style={styles.successLabel}>PEÇA</Text><Text style={styles.successValue}>{piece.id}</Text></View><View><Text style={styles.successLabel}>OPERADOR</Text><Text style={styles.successValue}>{operator.registration}</Text></View><View><Text style={styles.successLabel}>DATA E HORA</Text><Text style={styles.successValue}>17 SET 2026  •  10:01</Text></View></View><PrimaryButton label="Escanear próxima" icon="qr-code-scanner" onPress={onNext} /><Pressable onPress={onHome} style={styles.secondaryLink}><Text style={styles.secondaryLinkText}>Voltar para o início</Text></Pressable></View>
    </ScreenContainer>
  );
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{ focus?: string }>();
  const [view, setView] = useState<ScreenView>("home");
  const [action, setAction] = useState<ActionType>("Avançar");
  const [reason, setReason] = useState("");
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    if (params.focus === "piece") setView("detail");
  }, [params.focus]);

  const successAction = useMemo(() => {
    if (action === "Avançar") return "Peça avançou para Teste";
    if (action === "Evidências") return "Evidências adicionadas";
    return `${action} enviada para validação`;
  }, [action]);

  if (view === "scan") return <ScanView onBack={() => setView("home")} onConfirm={() => setView("detail")} />;
  if (view === "detail") return <DetailView onBack={() => setView("home")} onAdvance={() => { setAction("Avançar"); setView("success"); }} onJustify={(nextAction) => { setAction(nextAction); setReason(""); setView("justify"); }} onPhotos={() => { setAction("Evidências"); setView("photos"); }} />;
  if (view === "justify") return <JustificationView action={action as "Devolver" | "Cancelar"} reason={reason} setReason={setReason} onBack={() => setView("detail")} onSend={() => setView("success")} />;
  if (view === "photos") return <PhotosView count={photoCount} onBack={() => setView("detail")} onAdd={() => { tapFeedback(); setPhotoCount((current) => current + 1); }} onFinish={() => setView("success")} />;
  if (view === "success") return <SuccessView action={successAction} onNext={() => { setPhotoCount(0); setView("scan"); }} onHome={() => setView("home")} />;
  return <HomeView onScan={() => setView("scan")} onOpenAlert={() => Alert.alert("Alertas", "Acesse a aba Alertas para visualizar todas as peças prioritárias.")} onOpenPiece={() => setView("detail")} />;
}

const styles = StyleSheet.create({
  homeContent: { paddingTop: 18, paddingBottom: 34 },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 26 },
  renaultMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.yellow, alignItems: "center", justifyContent: "center" },
  renaultMarkText: { fontSize: 25, fontWeight: "900", color: COLORS.ink, fontStyle: "italic" },
  brandCopy: { marginLeft: 10, flex: 1 },
  brandName: { fontSize: 14, letterSpacing: 2.3, fontWeight: "900", color: COLORS.ink },
  brandProduct: { fontSize: 9, letterSpacing: 1.9, color: COLORS.muted, marginTop: 3, fontWeight: "700" },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.line },
  greetingRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 },
  eyebrow: { fontSize: 11, letterSpacing: 1.6, color: COLORS.muted, fontWeight: "800", marginBottom: 5 },
  pageTitle: { fontSize: 29, lineHeight: 34, fontWeight: "800", color: COLORS.ink, letterSpacing: -0.8 },
  syncBadge: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  syncDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.success },
  syncText: { fontSize: 9, fontWeight: "800", color: COLORS.success, letterSpacing: 1 },
  operatorCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.line },
  avatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.ink, justifyContent: "center", alignItems: "center" },
  avatarText: { color: COLORS.yellow, fontWeight: "900", fontSize: 14 },
  operatorCopy: { flex: 1, marginLeft: 11 },
  operatorName: { fontSize: 14, color: COLORS.ink, fontWeight: "800" },
  operatorMeta: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  operatorDock: { borderLeftWidth: 1, borderLeftColor: COLORS.line, paddingLeft: 13 },
  smallLabel: { fontSize: 8, color: COLORS.muted, letterSpacing: 1.2, fontWeight: "800" },
  operatorDockText: { fontSize: 12, fontWeight: "800", color: COLORS.blue, marginTop: 4 },
  primaryButton: { height: 58, borderRadius: 16, backgroundColor: COLORS.yellow, flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center" },
  primaryButtonText: { color: COLORS.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.2 },
  disabledButton: { backgroundColor: "#D9D9D9" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  scanHint: { textAlign: "center", color: COLORS.muted, fontSize: 10, lineHeight: 15, marginTop: 9, marginBottom: 27 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "900", letterSpacing: -0.2 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { color: COLORS.critical, fontSize: 11, fontWeight: "800" },
  alertCard: { flexDirection: "row", backgroundColor: COLORS.white, borderRadius: 17, padding: 14, borderWidth: 1, borderColor: "#F0C3C3", marginBottom: 24 },
  alertIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center", marginRight: 11 },
  alertCopy: { flex: 1 },
  alertTitle: { color: COLORS.ink, fontWeight: "800", fontSize: 13, lineHeight: 18 },
  alertDescription: { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  alertBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 11 },
  criticalText: { color: COLORS.critical, fontSize: 11, fontWeight: "900" },
  alertAction: { color: COLORS.critical, fontSize: 10, fontWeight: "900", flexDirection: "row", alignItems: "center" },
  mutedCaption: { fontSize: 9, color: COLORS.muted, fontWeight: "800", letterSpacing: 1.1 },
  statsRow: { flexDirection: "row", gap: 9, marginBottom: 18 },
  statCard: { flex: 1, padding: 13, backgroundColor: COLORS.white, borderRadius: 15, borderWidth: 1, borderColor: COLORS.line },
  statValue: { fontSize: 23, color: COLORS.ink, fontWeight: "900", letterSpacing: -0.5 },
  statLabel: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  lastMovement: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 15, padding: 14, borderWidth: 1, borderColor: COLORS.line },
  lastIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#EAF7EE", alignItems: "center", justifyContent: "center", marginRight: 10 },
  lastTitle: { fontSize: 11, fontWeight: "800", color: COLORS.ink },
  lastMeta: { fontSize: 9, color: COLORS.muted, marginTop: 4 },
  header: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerBack: { width: 36, height: 36, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "900", color: COLORS.ink },
  detailContent: { paddingTop: 12, paddingBottom: 32 },
  detailHero: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  detailIcon: { width: 52, height: 52, backgroundColor: COLORS.yellow, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 12 },
  detailCode: { fontSize: 24, fontWeight: "900", color: COLORS.ink, letterSpacing: 0.2 },
  detailDescription: { fontSize: 11, color: COLORS.muted, marginTop: 3 },
  dockTag: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 7, paddingHorizontal: 9, borderRadius: 9, borderWidth: 1 },
  dockDot: { width: 7, height: 7, borderRadius: 4 },
  dockTagText: { fontSize: 9, fontWeight: "900" },
  statusStrip: { flexDirection: "row", alignItems: "center", padding: 11, borderRadius: 11, backgroundColor: "#EAF7EE", marginBottom: 20 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 7 },
  statusStripText: { flex: 1, fontSize: 10, color: COLORS.success, fontWeight: "900", letterSpacing: 0.6 },
  statusDays: { fontSize: 12, color: COLORS.success, fontWeight: "900" },
  block: { backgroundColor: COLORS.white, borderRadius: 16, padding: 15, marginBottom: 14, borderWidth: 1, borderColor: COLORS.line },
  blockHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  blockTitle: { fontSize: 14, fontWeight: "900", color: COLORS.ink },
  blockMeta: { color: COLORS.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  stepper: { flexDirection: "row", alignItems: "flex-start" },
  stepItem: { alignItems: "center", width: 57 },
  stepCircleDone: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success, alignItems: "center", justifyContent: "center" },
  stepCircleCurrent: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.yellow, alignItems: "center", justifyContent: "center" },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, alignItems: "center", justifyContent: "center" },
  stepCircleText: { fontSize: 11, color: COLORS.ink, fontWeight: "900" },
  stepCircleMuted: { fontSize: 11, color: COLORS.muted, fontWeight: "800" },
  stepLabelDone: { fontSize: 8, color: COLORS.success, fontWeight: "800", textAlign: "center", marginTop: 7 },
  stepLabelCurrent: { fontSize: 8, color: COLORS.ink, fontWeight: "900", textAlign: "center", marginTop: 7 },
  stepLabel: { fontSize: 8, color: COLORS.muted, fontWeight: "700", textAlign: "center", marginTop: 7 },
  stepLineDone: { height: 2, flex: 1, backgroundColor: COLORS.success, marginTop: 11 },
  stepLine: { height: 2, flex: 1, backgroundColor: COLORS.line, marginTop: 11 },
  evidenceRow: { flexDirection: "row", alignItems: "center" },
  evidenceIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: COLORS.soft, alignItems: "center", justifyContent: "center", marginRight: 10 },
  evidenceTitle: { color: COLORS.ink, fontSize: 12, fontWeight: "800" },
  evidenceDescription: { color: COLORS.muted, fontSize: 10, lineHeight: 14, marginTop: 3 },
  actions: { marginTop: 4, marginBottom: 17 },
  outlineButton: { height: 52, borderRadius: 15, borderWidth: 1.5, borderColor: COLORS.ink, flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  outlineButtonText: { color: COLORS.ink, fontSize: 13, fontWeight: "900" },
  dangerButton: { borderColor: COLORS.critical },
  dangerButtonText: { color: COLORS.critical },
  actionPair: { flexDirection: "row", gap: 10, marginTop: 10 },
  auditNote: { color: COLORS.muted, fontSize: 10, textAlign: "center", lineHeight: 15, paddingHorizontal: 20 },
  scanScreen: { flex: 1, justifyContent: "space-between" },
  scanTop: { height: 58, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  scanClose: { width: 36, height: 36, justifyContent: "center" },
  scanMode: { flexDirection: "row", alignItems: "center", gap: 7 },
  scanModeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.yellow },
  scanModeText: { color: COLORS.white, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  scanCenter: { alignItems: "center", marginTop: -50 },
  scanTitle: { color: COLORS.white, fontSize: 25, fontWeight: "900" },
  scanSubtitle: { color: "#AFAFAF", fontSize: 12, marginTop: 6, marginBottom: 28 },
  scanFrame: { width: "90%", height: 210, borderWidth: 1, borderColor: "#555", borderRadius: 18, position: "relative", justifyContent: "center", alignItems: "center" },
  corner: { position: "absolute", width: 28, height: 28, borderColor: COLORS.yellow },
  cornerTL: { top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 10 },
  cornerTR: { top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 10 },
  cornerBL: { bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 10 },
  scanLine: { width: "85%", height: 2, backgroundColor: COLORS.yellow, opacity: 0.85 },
  recognized: { position: "absolute", bottom: 16, flexDirection: "row", alignItems: "center", gap: 5 },
  recognizedText: { color: COLORS.success, fontSize: 10, fontWeight: "800" },
  scanResult: { backgroundColor: "#222", borderRadius: 14, padding: 14, width: "90%", marginTop: 22, borderWidth: 1, borderColor: "#3E3E3E" },
  scanResultLabel: { color: "#9F9F9F", fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  scanResultCode: { color: COLORS.white, fontSize: 27, fontWeight: "900", marginTop: 4, letterSpacing: 1 },
  scanResultDesc: { color: "#B6B6B6", fontSize: 11, marginTop: 2 },
  scanBottom: { paddingBottom: 8 },
  scanBottomHint: { color: "#858585", textAlign: "center", fontSize: 10, marginBottom: 12 },
  retry: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 14 },
  retryText: { color: COLORS.white, fontSize: 12, fontWeight: "800" },
  justifyContent: { paddingTop: 14, paddingBottom: 25, flexGrow: 1 },
  warningHero: { flexDirection: "row", padding: 15, borderRadius: 16, backgroundColor: "#FFF1F1", borderWidth: 1, borderColor: "#F2C4C4", marginBottom: 25 },
  warningIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center", marginRight: 11 },
  warningTitle: { color: COLORS.ink, fontWeight: "900", fontSize: 14 },
  warningDescription: { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  formLabel: { color: COLORS.ink, fontSize: 12, fontWeight: "900", marginBottom: 10 },
  required: { color: COLORS.critical },
  chips: { flexDirection: "row", gap: 8, marginBottom: 24 },
  chip: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  chipSelected: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  chipText: { color: COLORS.muted, fontSize: 11, fontWeight: "800" },
  chipTextSelected: { color: COLORS.white },
  justificationInput: { backgroundColor: COLORS.white, minHeight: 150, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, padding: 14, fontSize: 13, color: COLORS.ink, lineHeight: 19 },
  counterRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 7, marginBottom: 10 },
  minimumText: { fontSize: 10, color: COLORS.muted },
  counter: { fontSize: 10, color: COLORS.muted },
  validationNote: { textAlign: "center", color: COLORS.muted, fontSize: 10, marginTop: 10 },
  photoScreen: { flex: 1, justifyContent: "space-between" },
  photoCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  photoTarget: { height: 300, width: "90%", borderRadius: 22, borderWidth: 1, borderColor: "#555", alignItems: "center", justifyContent: "center" },
  photoTargetTitle: { color: COLORS.white, fontSize: 17, fontWeight: "900", marginTop: 13 },
  photoTargetHint: { color: "#989898", fontSize: 11, textAlign: "center", marginTop: 7, paddingHorizontal: 25, lineHeight: 16 },
  photoBottom: { paddingBottom: 9 },
  thumbnails: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 15 },
  thumbnailLabel: { flex: 1 },
  thumbnailLabelText: { color: "#919191", fontSize: 9, letterSpacing: 1, fontWeight: "800" },
  thumbnail: { width: 42, height: 42, borderRadius: 9, justifyContent: "flex-end", alignItems: "flex-end", padding: 4 },
  thumbnailNumber: { color: COLORS.white, fontSize: 9, fontWeight: "900" },
  addThumbnail: { width: 42, height: 42, borderRadius: 9, borderWidth: 1, borderColor: "#686868", alignItems: "center", justifyContent: "center" },
  photoSkip: { alignItems: "center", padding: 13 },
  photoSkipText: { color: "#A7A7A7", fontSize: 11, fontWeight: "700" },
  successScreen: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 25 },
  successMark: { width: 92, height: 92, borderRadius: 46, backgroundColor: COLORS.success, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  successKicker: { color: COLORS.success, fontSize: 10, fontWeight: "900", letterSpacing: 1.6 },
  successTitle: { color: COLORS.ink, fontSize: 25, fontWeight: "900", textAlign: "center", marginTop: 8 },
  successDescription: { color: COLORS.muted, fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 8, maxWidth: 275 },
  successCard: { width: "100%", backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, marginTop: 25, marginBottom: 18, padding: 16, gap: 14 },
  successLabel: { color: COLORS.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  successValue: { color: COLORS.ink, fontSize: 13, fontWeight: "900", marginTop: 4 },
  secondaryLink: { padding: 14 },
  secondaryLinkText: { color: COLORS.ink, fontSize: 12, fontWeight: "800", textDecorationLine: "underline" },
});
