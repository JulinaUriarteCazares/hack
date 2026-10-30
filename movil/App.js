import { useEffect, useMemo, useState } from 'react';
import { BackHandler, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  ACTUALIZADO, ALCALDIA_2027, ASPIRANTES, ELECCION, ENCUESTA, ETIQUETAS, PREGUNTAS, RESUMEN, colorPartido,
} from './datos';
import { MUNICIPIOS } from './municipios';

// Colores para modo claro y oscuro (el teléfono decide cuál usar)
const CLARO = { fondo: '#f4f5f2', tarjeta: '#ffffff', tinta: '#1c2321', gris: '#5b6662', linea: '#d9ddd8', sol: '#c98a12', solSuave: '#f6ebd2', enlace: '#8a5c00', boton: '#1c2321', botonTexto: '#ffffff' };
const OSCURO = { fondo: '#141917', tarjeta: '#1f2624', tinta: '#e8ece9', gris: '#9aa6a1', linea: '#333c39', sol: '#e8ac3a', solSuave: '#3a2f17', enlace: '#e8ac3a', boton: '#e8ac3a', botonTexto: '#1c2321' };

const PESTANAS = [
  { id: 'inicio', texto: 'Inicio', icono: 'home' },
  { id: 'gob', texto: 'Gobernador', icono: 'people' },
  { id: 'mun', texto: 'Mi municipio', icono: 'location' },
  { id: 'votar', texto: 'Decidir', icono: 'checkbox' },
];

const MAS_POBLADOS = ['Hermosillo', 'Cajeme', 'Nogales', 'San Luis Río Colorado', 'Navojoa', 'Guaymas'];

export default function App() {
  return (
    <SafeAreaProvider>
      <Principal />
    </SafeAreaProvider>
  );
}

function Principal() {
  const C = useColorScheme() === 'dark' ? OSCURO : CLARO;
  const s = useMemo(() => estilos(C), [C]);
  const [pestana, setPestana] = useState('inicio');
  const insets = useSafeAreaInsets();
  const ui = { C, s };
  return (
    <SafeAreaView style={s.app} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        {pestana === 'inicio' && <Inicio ui={ui} ir={setPestana} />}
        {pestana === 'gob' && <Gobernador ui={ui} />}
        {pestana === 'mun' && <Municipio ui={ui} />}
        {pestana === 'votar' && <Decidir ui={ui} />}
      </View>
      <View style={[s.barra, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {PESTANAS.map((p) => {
          const activa = p.id === pestana;
          return (
            <Pressable key={p.id} style={s.barraBoton} onPress={() => setPestana(p.id)} accessibilityRole="tab" accessibilityState={{ selected: activa }} accessibilityLabel={p.texto}>
              <View style={[s.barraPildora, activa && { backgroundColor: C.solSuave }]}>
                <Ionicons name={activa ? p.icono : `${p.icono}-outline`} size={22} color={activa ? C.sol : C.gris} />
              </View>
              <Text style={[s.barraTexto, activa && { color: C.tinta, fontWeight: '700' }]}>{p.texto}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* ---------- Pantallas ---------- */

function Inicio({ ui, ir }) {
  const { C, s } = ui;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = Math.round((ELECCION - hoy) / 864e5);
  return (
    <Pantalla s={s}>
      <Text style={s.pequeno}>Actualizado: {ACTUALIZADO}</Text>
      <Text style={s.titulo}>¿Quién quiere gobernar Sonora?</Text>
      <View style={[s.tarjeta, s.fila, { backgroundColor: C.solSuave, borderColor: C.sol, gap: 14 }]}>
        <Ionicons name="calendar" size={36} color={C.sol} />
        <View style={{ flex: 1 }}>
          <Text style={s.grande}>{dias > 0 ? `Faltan ${dias} días` : 'Ya pasó la elección'}</Text>
          <Text style={s.texto}>para votar · 6 de junio de 2027</Text>
        </View>
      </View>

      <Text style={s.subtitulo}>En 1 minuto</Text>
      <View style={[s.tarjeta, { gap: 10 }]}>
        {RESUMEN.map((r) => (
          <View key={r} style={s.punto}>
            <Ionicons name="checkmark-circle" size={20} color={C.sol} style={{ marginTop: 2 }} />
            <Text style={[s.texto, { flex: 1 }]}>{r}</Text>
          </View>
        ))}
      </View>

      <Text style={s.subtitulo}>¿Qué quieres ver?</Text>
      <BotonGrande ui={ui} icono="people" texto="Quién quiere ser gobernador" ayuda="4 aspirantes y lo que se les critica" onPress={() => ir('gob')} />
      <BotonGrande ui={ui} icono="location" texto="Quién gobierna mi municipio" ayuda="Busca entre los 72 de Sonora" onPress={() => ir('mun')} />
      <BotonGrande ui={ui} icono="checkbox" texto="Cómo decidir mi voto" ayuda="6 preguntas antes de votar" onPress={() => ir('votar')} />
    </Pantalla>
  );
}

function Gobernador({ ui }) {
  const { C, s } = ui;
  const [elegido, setElegido] = useState(null);
  const [verColores, setVerColores] = useState(false);
  const i = ASPIRANTES.findIndex((a) => a.id === elegido);
  if (i >= 0) {
    const sig = ASPIRANTES[(i + 1) % ASPIRANTES.length];
    return <Ficha ui={ui} p={ASPIRANTES[i]} volver={() => setElegido(null)} siguiente={sig} irA={setElegido} />;
  }
  return (
    <Pantalla s={s}>
      <Text style={s.titulo}>Gobernador</Text>
      <Text style={s.texto}>Toca un nombre para ver qué se le critica.</Text>

      <Pressable onPress={() => setVerColores(!verColores)} style={s.fila} hitSlop={8}>
        <Ionicons name="help-circle-outline" size={20} color={C.enlace} />
        <Text style={s.enlace}>¿Qué significan las etiquetas?</Text>
      </Pressable>
      {verColores && (
        <View style={[s.tarjeta, { gap: 8 }]}>
          {Object.keys(ETIQUETAS).map((k) => (
            <View key={k} style={s.fila}>
              <Etiqueta s={s} tipo={k} />
              <Text style={[s.pequeno, { flex: 1 }]}>{ETIQUETAS[k].ayuda}</Text>
            </View>
          ))}
        </View>
      )}

      {ASPIRANTES.map((a) => {
        const peor = a.puntos[0];
        return (
          <Pressable key={a.id} onPress={() => setElegido(a.id)} style={({ pressed }) => [s.tarjeta, { borderLeftWidth: 6, borderLeftColor: colorPartido(a.partido) }, pressed && { opacity: 0.7 }]} accessibilityRole="button">
            <View style={[s.fila, { gap: 12 }]}>
              <Avatar s={s} p={a} />
              <View style={{ flex: 1 }}>
                <Text style={s.nombre}>{a.nombre}</Text>
                <Partido s={s} nombre={a.partido} />
              </View>
              <Ionicons name="chevron-forward" size={22} color={C.gris} />
            </View>
            <Text style={s.texto}>{a.enUnaFrase}</Text>
            <View style={[s.fila, { marginTop: 4 }]}>
              <Etiqueta s={s} tipo={peor.tipo} />
              <Text style={[s.pequeno, { flex: 1 }]}>{peor.titulo}</Text>
            </View>
          </Pressable>
        );
      })}

      <View style={[s.tarjeta, { borderLeftWidth: 6, borderLeftColor: C.sol }]}>
        <View style={s.fila}>
          <Ionicons name="stats-chart" size={20} color={C.sol} />
          <Text style={[s.subtitulo, { marginTop: 0 }]}>¿Cómo van?</Text>
        </View>
        <Text style={s.texto}>{ENCUESTA.texto}</Text>
        <Text style={s.pequeno}>Una encuesta es una foto del momento, no el resultado.</Text>
        <Fuente ui={ui} texto={ENCUESTA.fuente} url={ENCUESTA.url} />
      </View>
    </Pantalla>
  );
}

function Ficha({ ui, p, volver, siguiente, irA }) {
  const { C, s } = ui;
  const [abierto, setAbierto] = useState(0);

  // Botón "atrás" de Android regresa a la lista
  useEffect(() => {
    setAbierto(0);
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { volver(); return true; });
    return () => sub.remove();
  }, [p.id]);

  return (
    <Pantalla s={s} key={p.id}>
      <Pressable onPress={volver} hitSlop={12} style={s.fila} accessibilityRole="button" accessibilityLabel="Volver a la lista">
        <Ionicons name="chevron-back" size={22} color={C.enlace} />
        <Text style={s.enlace}>Todos los aspirantes</Text>
      </Pressable>

      <View style={[s.fila, { gap: 14, marginTop: 4 }]}>
        <Avatar s={s} p={p} grande />
        <View style={{ flex: 1 }}>
          <Text style={s.titulo}>{p.nombre}</Text>
          <Partido s={s} nombre={p.partido} />
        </View>
      </View>
      <Text style={s.texto}><Text style={{ fontWeight: '700' }}>Hoy: </Text>{p.hoy}</Text>

      <Text style={s.subtitulo}>Lo que se le critica ({p.puntos.length})</Text>
      <Text style={s.pequeno}>Toca cada punto para ver más.</Text>
      {p.puntos.map((pt, i) => {
        const aqui = abierto === i;
        return (
          <Pressable key={pt.titulo} onPress={() => setAbierto(aqui ? -1 : i)} style={[s.tarjeta, aqui && { borderColor: C.sol }]} accessibilityRole="button" accessibilityState={{ expanded: aqui }}>
            <View style={s.fila}>
              <Etiqueta s={s} tipo={pt.tipo} />
              <Ionicons name={aqui ? 'chevron-up' : 'chevron-down'} size={20} color={C.gris} style={{ marginLeft: 'auto' }} />
            </View>
            <Text style={s.nombrePunto}>{pt.titulo}</Text>
            {aqui && (
              <View style={{ gap: 8, marginTop: 4 }}>
                <Text style={s.texto}>{pt.detalle}</Text>
                <View style={[s.caja, { backgroundColor: C.fondo }]}>
                  <Text style={s.pequenoFuerte}>¿EN QUÉ QUEDÓ?</Text>
                  <Text style={s.texto}>{pt.quedo}</Text>
                </View>
                <Fuente ui={ui} texto="Ver la noticia" url={pt.url} />
              </View>
            )}
          </Pressable>
        );
      })}

      <Text style={s.subtitulo}>Lo que presume</Text>
      <View style={[s.tarjeta, s.punto]}>
        <Ionicons name="thumbs-up-outline" size={20} color={C.gris} style={{ marginTop: 2 }} />
        <Text style={[s.texto, { flex: 1 }]}>{p.presume}</Text>
      </View>

      <View style={[s.caja, { backgroundColor: C.solSuave }]}>
        <Text style={s.pequeno}>Una acusación no es una condena. Revisa la fuente antes de decidir.</Text>
      </View>

      <BotonGrande ui={ui} icono="arrow-forward" texto={`Siguiente: ${siguiente.nombre}`} ayuda={siguiente.partido} onPress={() => irA(siguiente.id)} />
    </Pantalla>
  );
}

function Municipio({ ui }) {
  const { C, s } = ui;
  const [busca, setBusca] = useState('');
  const [elegido, setElegido] = useState('Hermosillo');
  const q = quitarAcentos(busca.trim());
  const lista = useMemo(() => (q ? MUNICIPIOS.filter((m) => quitarAcentos(m[0]).includes(q)) : []), [q]);
  const [nombre, alcalde, partido, nota] = MUNICIPIOS.find((m) => m[0] === elegido);
  const elegir = (m) => { setElegido(m); setBusca(''); };

  return (
    <Pantalla s={s}>
      <Text style={s.titulo}>Mi municipio</Text>

      <View style={[s.input, s.fila]}>
        <Ionicons name="search" size={20} color={C.gris} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Escribe tu municipio…"
          placeholderTextColor={C.gris}
          style={s.inputTexto}
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => lista[0] && elegir(lista[0][0])}
        />
        {busca ? (
          <Pressable onPress={() => setBusca('')} hitSlop={10} accessibilityLabel="Borrar búsqueda">
            <Ionicons name="close-circle" size={20} color={C.gris} />
          </Pressable>
        ) : null}
      </View>

      {q ? (
        <View style={[s.tarjeta, { padding: 0, gap: 0, overflow: 'hidden' }]}>
          {lista.length === 0 && <Text style={[s.texto, { padding: 14 }]}>No encontramos “{busca}”. Revisa cómo se escribe.</Text>}
          {lista.slice(0, 6).map((m) => (
            <Pressable key={m[0]} onPress={() => elegir(m[0])} style={({ pressed }) => [s.opcion, pressed && { backgroundColor: C.solSuave }]}>
              <Text style={s.texto}>{m[0]}</Text>
              <Partido s={s} nombre={m[2]} />
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={s.chips}>
          {MAS_POBLADOS.map((m) => (
            <Pressable key={m} onPress={() => elegir(m)} style={[s.chip, m === elegido && { backgroundColor: C.boton, borderColor: C.boton }]}>
              <Text style={[s.chipTexto, m === elegido && { color: C.botonTexto }]}>{m}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={[s.tarjeta, { borderLeftWidth: 6, borderLeftColor: colorPartido(partido) }]}>
        <Text style={s.nombre}>{nombre}</Text>
        <Text style={[s.pequenoFuerte, { marginTop: 6 }]}>ALCALDE HOY (2024–2027)</Text>
        <Text style={s.texto}>{alcalde}</Text>
        <Partido s={s} nombre={partido} />
        {nota ? (
          <View style={[s.caja, { backgroundColor: C.fondo, marginTop: 6 }]}>
            <Text style={s.pequeno}>{nota}</Text>
          </View>
        ) : null}
      </View>

      <View style={s.tarjeta}>
        <View style={s.fila}>
          <Ionicons name="flag-outline" size={20} color={C.sol} />
          <Text style={[s.subtitulo, { marginTop: 0, flex: 1 }]}>¿Quién quiere ser alcalde en 2027?</Text>
        </View>
        <Text style={s.texto}>{ALCALDIA_2027[nombre] || 'Aún no hay aspirantes públicos. Los partidos los anuncian entre diciembre y marzo.'}</Text>
      </View>
    </Pantalla>
  );
}

function Decidir({ ui }) {
  const { C, s } = ui;
  const [hechas, setHechas] = useState([]);
  const cambiar = (i) => setHechas((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]));
  const listo = hechas.length === PREGUNTAS.length;
  return (
    <Pantalla s={s}>
      <Text style={s.titulo}>Antes de votar, pregúntate</Text>
      <Text style={s.texto}>Sirve para gobernador, alcalde o diputado. Toca cada pregunta cuando ya la tengas clara.</Text>

      <View style={s.progreso}>
        <View style={[s.progresoLleno, { width: `${(hechas.length / PREGUNTAS.length) * 100}%` }]} />
      </View>
      <Text style={s.pequenoFuerte}>{listo ? '¡LISTO! YA TIENES CON QUÉ DECIDIR' : `${hechas.length} DE ${PREGUNTAS.length}`}</Text>

      {PREGUNTAS.map((q, i) => {
        const ok = hechas.includes(i);
        return (
          <Pressable key={q} onPress={() => cambiar(i)} style={[s.tarjeta, s.fila, { gap: 12 }, ok && { backgroundColor: C.solSuave, borderColor: C.sol }]} accessibilityRole="checkbox" accessibilityState={{ checked: ok }}>
            <Ionicons name={ok ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={ok ? C.sol : C.gris} />
            <Text style={[s.texto, { flex: 1 }]}>{q}</Text>
          </Pressable>
        );
      })}

      <Text style={s.subtitulo}>Verifica por tu cuenta</Text>
      <BotonGrande ui={ui} icono="open-outline" texto="INE" ayuda="Tu casilla y quiénes son los candidatos" onPress={() => Linking.openURL('https://www.ine.mx')} />
      <BotonGrande ui={ui} icono="open-outline" texto="IEE Sonora" ayuda="Calendario y registro de candidaturas" onPress={() => Linking.openURL('https://www.ieesonora.org.mx')} />
    </Pantalla>
  );
}

/* ---------- Piezas ---------- */

function Pantalla({ s, children }) {
  return <ScrollView contentContainerStyle={s.pantalla} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

function BotonGrande({ ui, icono, texto, ayuda, onPress }) {
  const { C, s } = ui;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.tarjeta, s.fila, { gap: 14 }, pressed && { opacity: 0.7 }]} accessibilityRole="button">
      <View style={[s.iconoCaja, { backgroundColor: C.solSuave }]}>
        <Ionicons name={icono} size={22} color={C.sol} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.nombrePunto}>{texto}</Text>
        {ayuda ? <Text style={s.pequeno}>{ayuda}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={22} color={C.gris} />
    </Pressable>
  );
}

function Avatar({ s, p, grande }) {
  const partes = p.nombre.split(' ');
  const iniciales = partes[0][0] + partes[partes.length - 1][0];
  const t = grande ? 60 : 46;
  return (
    <View style={[s.avatar, { width: t, height: t, borderRadius: t / 2, backgroundColor: colorPartido(p.partido) }]}>
      <Text style={[s.avatarTexto, { fontSize: t * 0.38 }]}>{iniciales}</Text>
    </View>
  );
}

function Etiqueta({ s, tipo }) {
  const e = ETIQUETAS[tipo];
  return (
    <View style={[s.etiqueta, { backgroundColor: e.fondo }]}>
      <Text style={[s.etiquetaTexto, { color: e.letra }]}>{e.texto}</Text>
    </View>
  );
}

function Partido({ s, nombre }) {
  return (
    <View style={s.fila}>
      <View style={[s.cuadro, { backgroundColor: colorPartido(nombre) }]} />
      <Text style={s.pequeno}>{nombre}</Text>
    </View>
  );
}

function Fuente({ ui, texto, url }) {
  const { C, s } = ui;
  return (
    <Pressable onPress={() => Linking.openURL(url)} hitSlop={8} style={s.fila} accessibilityRole="link">
      <Text style={s.enlace}>{texto}</Text>
      <Ionicons name="open-outline" size={16} color={C.enlace} />
    </Pressable>
  );
}

const quitarAcentos = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const estilos = (C) => StyleSheet.create({
  app: { flex: 1, backgroundColor: C.fondo },
  pantalla: { padding: 16, gap: 12, paddingBottom: 32 },
  titulo: { fontSize: 27, fontWeight: '800', color: C.tinta, lineHeight: 32 },
  subtitulo: { fontSize: 19, fontWeight: '700', color: C.tinta, marginTop: 8 },
  nombre: { fontSize: 20, fontWeight: '700', color: C.tinta },
  nombrePunto: { fontSize: 17, fontWeight: '700', color: C.tinta },
  grande: { fontSize: 26, fontWeight: '800', color: C.tinta },
  texto: { fontSize: 16, lineHeight: 23, color: C.tinta },
  pequeno: { fontSize: 14, lineHeight: 19, color: C.gris },
  pequenoFuerte: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: C.gris },
  enlace: { fontSize: 15, fontWeight: '700', color: C.enlace },
  tarjeta: { backgroundColor: C.tarjeta, borderWidth: 1, borderColor: C.linea, borderRadius: 14, padding: 16, gap: 6 },
  caja: { borderRadius: 10, padding: 12, gap: 2 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  punto: { flexDirection: 'row', gap: 10 },
  cuadro: { width: 10, height: 10, borderRadius: 2 },
  etiqueta: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  etiquetaTexto: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  iconoCaja: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarTexto: { color: '#ffffff', fontWeight: '800' },
  input: { backgroundColor: C.tarjeta, borderWidth: 1, borderColor: C.linea, borderRadius: 14, paddingHorizontal: 14, minHeight: 52 },
  inputTexto: { flex: 1, fontSize: 17, color: C.tinta, paddingVertical: 12 },
  opcion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: C.linea, paddingVertical: 14, paddingHorizontal: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: C.linea, backgroundColor: C.tarjeta, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  chipTexto: { fontSize: 15, color: C.tinta },
  progreso: { height: 10, borderRadius: 5, backgroundColor: C.linea, overflow: 'hidden' },
  progresoLleno: { height: '100%', backgroundColor: C.sol, borderRadius: 5 },
  barra: { flexDirection: 'row', backgroundColor: C.tarjeta, borderTopWidth: 1, borderColor: C.linea, paddingTop: 6 },
  barraBoton: { flex: 1, alignItems: 'center', gap: 2, minHeight: 52, justifyContent: 'center' },
  barraPildora: { paddingHorizontal: 16, paddingVertical: 3, borderRadius: 999 },
  barraTexto: { fontSize: 12, color: C.gris },
});
