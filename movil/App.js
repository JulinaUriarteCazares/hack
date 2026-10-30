import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ACTUALIZADO, ALCALDIA_2027, ASPIRANTES, ELECCION, ENCUESTA, ETIQUETAS, PREGUNTAS, RESUMEN, colorPartido,
} from './datos';
import { MUNICIPIOS } from './municipios';

const C = { fondo: '#f4f5f2', tarjeta: '#ffffff', tinta: '#1c2321', gris: '#5b6662', linea: '#d9ddd8', sol: '#c98a12', solSuave: '#f6ebd2' };

const PESTANAS = [
  { id: 'inicio', texto: 'Inicio', icono: '⌂' },
  { id: 'gob', texto: 'Gobernador', icono: '★' },
  { id: 'mun', texto: 'Mi municipio', icono: '⌖' },
  { id: 'votar', texto: 'Decidir', icono: '✓' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Principal />
    </SafeAreaProvider>
  );
}

function Principal() {
  const [pestana, setPestana] = useState('inicio');
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={s.app} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        {pestana === 'inicio' && <Inicio ir={setPestana} />}
        {pestana === 'gob' && <Gobernador />}
        {pestana === 'mun' && <Municipio />}
        {pestana === 'votar' && <Decidir />}
      </View>
      <View style={[s.barra, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {PESTANAS.map((p) => {
          const activa = p.id === pestana;
          return (
            <Pressable key={p.id} style={s.barraBoton} onPress={() => setPestana(p.id)} accessibilityRole="tab" accessibilityState={{ selected: activa }}>
              <Text style={[s.barraIcono, activa && { color: C.sol }]}>{p.icono}</Text>
              <Text style={[s.barraTexto, activa && { color: C.tinta, fontWeight: '700' }]}>{p.texto}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* ---------- Pantallas ---------- */

function Inicio({ ir }) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = Math.round((ELECCION - hoy) / 864e5);
  return (
    <Pantalla>
      <Text style={s.pequeno}>Actualizado: {ACTUALIZADO}</Text>
      <Text style={s.titulo}>¿Quién quiere gobernar Sonora?</Text>
      <View style={[s.tarjeta, { backgroundColor: C.solSuave, borderColor: C.sol }]}>
        <Text style={s.grande}>{dias > 0 ? `Faltan ${dias} días` : 'Ya pasó la elección'}</Text>
        <Text style={s.texto}>para votar (6 de junio de 2027)</Text>
      </View>
      <Text style={s.subtitulo}>En 1 minuto</Text>
      {RESUMEN.map((r) => (
        <View key={r} style={s.punto}>
          <Text style={{ color: C.sol, fontWeight: '700' }}>✓</Text>
          <Text style={[s.texto, { flex: 1 }]}>{r}</Text>
        </View>
      ))}
      <Text style={s.subtitulo}>¿Qué quieres ver?</Text>
      <Boton texto="★  Quién quiere ser gobernador" onPress={() => ir('gob')} />
      <Boton texto="⌖  Quién gobierna mi municipio" onPress={() => ir('mun')} />
      <Boton texto="✓  Cómo decidir mi voto" onPress={() => ir('votar')} />
    </Pantalla>
  );
}

function Gobernador() {
  const [elegido, setElegido] = useState(null);
  const p = ASPIRANTES.find((a) => a.id === elegido);
  if (p) return <Ficha p={p} volver={() => setElegido(null)} />;
  return (
    <Pantalla>
      <Text style={s.titulo}>Gobernador</Text>
      <Text style={s.texto}>Toca un nombre para ver qué se le critica.</Text>
      {ASPIRANTES.map((a) => {
        const peor = a.puntos[0];
        return (
          <Pressable key={a.id} onPress={() => setElegido(a.id)} style={({ pressed }) => [s.tarjeta, { borderLeftWidth: 6, borderLeftColor: colorPartido(a.partido) }, pressed && { opacity: 0.7 }]}>
            <Partido nombre={a.partido} />
            <Text style={s.nombre}>{a.nombre}</Text>
            <Text style={s.texto}>{a.enUnaFrase}</Text>
            <View style={[s.fila, { marginTop: 6 }]}>
              <Etiqueta tipo={peor.tipo} />
              <Text style={[s.pequeno, { flex: 1 }]}>{peor.titulo}</Text>
            </View>
            <Text style={s.enlace}>Ver {a.puntos.length} puntos →</Text>
          </Pressable>
        );
      })}
      <View style={[s.tarjeta, { borderLeftWidth: 6, borderLeftColor: C.sol }]}>
        <Text style={s.subtitulo}>¿Cómo van?</Text>
        <Text style={s.texto}>{ENCUESTA.texto}</Text>
        <Fuente texto={ENCUESTA.fuente} url={ENCUESTA.url} />
        <Text style={s.pequeno}>Una encuesta es una foto del momento, no el resultado.</Text>
      </View>
    </Pantalla>
  );
}

function Ficha({ p, volver }) {
  const [abierto, setAbierto] = useState(0);
  return (
    <Pantalla>
      <Pressable onPress={volver} hitSlop={12}>
        <Text style={s.enlace}>← Volver</Text>
      </Pressable>
      <Partido nombre={p.partido} />
      <Text style={s.titulo}>{p.nombre}</Text>
      <Text style={s.texto}>Hoy: {p.hoy}</Text>
      <Text style={s.subtitulo}>Lo que se le critica</Text>
      <Text style={s.pequeno}>Toca cada punto para ver más.</Text>
      {p.puntos.map((pt, i) => {
        const abiertoAqui = abierto === i;
        return (
          <Pressable key={pt.titulo} onPress={() => setAbierto(abiertoAqui ? -1 : i)} style={s.tarjeta}>
            <View style={s.fila}>
              <Etiqueta tipo={pt.tipo} />
              <Text style={{ marginLeft: 'auto', color: C.gris }}>{abiertoAqui ? '−' : '+'}</Text>
            </View>
            <Text style={s.nombrePunto}>{pt.titulo}</Text>
            {abiertoAqui && (
              <>
                <Text style={s.texto}>{pt.detalle}</Text>
                <Text style={s.texto}><Text style={{ fontWeight: '700' }}>¿En qué quedó? </Text>{pt.quedo}</Text>
                <Fuente texto="Ver la noticia" url={pt.url} />
              </>
            )}
          </Pressable>
        );
      })}
      <Text style={s.subtitulo}>Lo que presume</Text>
      <Text style={s.texto}>{p.presume}</Text>
      <Text style={[s.pequeno, { marginTop: 12 }]}>Una acusación no es una condena. Revisa la fuente antes de decidir.</Text>
    </Pantalla>
  );
}

function Municipio() {
  const [busca, setBusca] = useState('');
  const [elegido, setElegido] = useState('Hermosillo');
  const lista = useMemo(() => {
    const q = quitarAcentos(busca.trim());
    return q ? MUNICIPIOS.filter((m) => quitarAcentos(m[0]).includes(q)) : [];
  }, [busca]);
  const [nombre, alcalde, partido, nota] = MUNICIPIOS.find((m) => m[0] === elegido);
  return (
    <Pantalla>
      <Text style={s.titulo}>Mi municipio</Text>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Escribe tu municipio…"
        placeholderTextColor={C.gris}
        style={s.input}
        autoCorrect={false}
      />
      {lista.slice(0, 6).map((m) => (
        <Pressable key={m[0]} onPress={() => { setElegido(m[0]); setBusca(''); }} style={s.opcion}>
          <Text style={s.texto}>{m[0]}</Text>
        </Pressable>
      ))}
      <View style={[s.tarjeta, { borderLeftWidth: 6, borderLeftColor: colorPartido(partido) }]}>
        <Text style={s.pequeno}>MUNICIPIO</Text>
        <Text style={s.nombre}>{nombre}</Text>
        <Text style={[s.pequeno, { marginTop: 8 }]}>ALCALDE HOY</Text>
        <Text style={s.texto}>{alcalde}</Text>
        <Partido nombre={partido} />
        {nota ? <Text style={[s.pequeno, { marginTop: 6 }]}>{nota}</Text> : null}
      </View>
      <View style={s.tarjeta}>
        <Text style={s.subtitulo}>¿Quién quiere ser alcalde en 2027?</Text>
        <Text style={s.texto}>{ALCALDIA_2027[nombre] || 'Aún no hay aspirantes públicos. Los partidos los anuncian entre diciembre y marzo.'}</Text>
      </View>
    </Pantalla>
  );
}

function Decidir() {
  const [hechas, setHechas] = useState([]);
  const cambiar = (i) => setHechas((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]));
  return (
    <Pantalla>
      <Text style={s.titulo}>Antes de votar, pregúntate</Text>
      <Text style={s.texto}>Sirve para gobernador, alcalde o diputado.</Text>
      {PREGUNTAS.map((q, i) => {
        const ok = hechas.includes(i);
        return (
          <Pressable key={q} onPress={() => cambiar(i)} style={[s.tarjeta, s.fila, ok && { backgroundColor: C.solSuave, borderColor: C.sol }]} accessibilityRole="checkbox" accessibilityState={{ checked: ok }}>
            <View style={[s.check, ok && { backgroundColor: C.sol, borderColor: C.sol }]}>
              {ok && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
            </View>
            <Text style={[s.texto, { flex: 1 }]}>{q}</Text>
          </Pressable>
        );
      })}
      <Text style={[s.subtitulo, { textAlign: 'center' }]}>
        {hechas.length === PREGUNTAS.length ? '¡Listo! Ya tienes con qué decidir.' : `${hechas.length} de ${PREGUNTAS.length}`}
      </Text>
      <Fuente texto="Busca tu casilla en el INE" url="https://www.ine.mx" />
    </Pantalla>
  );
}

/* ---------- Piezas ---------- */

function Pantalla({ children }) {
  return <ScrollView contentContainerStyle={s.pantalla} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

function Boton({ texto, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.boton, pressed && { opacity: 0.8 }]}>
      <Text style={s.botonTexto}>{texto}</Text>
    </Pressable>
  );
}

function Etiqueta({ tipo }) {
  const e = ETIQUETAS[tipo];
  return (
    <View style={[s.etiqueta, { backgroundColor: e.fondo }]}>
      <Text style={[s.etiquetaTexto, { color: e.letra }]}>{e.texto}</Text>
    </View>
  );
}

function Partido({ nombre }) {
  return (
    <View style={s.fila}>
      <View style={[s.cuadro, { backgroundColor: colorPartido(nombre) }]} />
      <Text style={s.pequeno}>{nombre}</Text>
    </View>
  );
}

function Fuente({ texto, url }) {
  return (
    <Pressable onPress={() => Linking.openURL(url)} hitSlop={8}>
      <Text style={s.enlace}>{texto} ↗</Text>
    </Pressable>
  );
}

const quitarAcentos = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.fondo },
  pantalla: { padding: 16, gap: 12, paddingBottom: 32 },
  titulo: { fontSize: 28, fontWeight: '800', color: C.tinta, lineHeight: 32 },
  subtitulo: { fontSize: 19, fontWeight: '700', color: C.tinta, marginTop: 8 },
  nombre: { fontSize: 21, fontWeight: '700', color: C.tinta },
  nombrePunto: { fontSize: 17, fontWeight: '700', color: C.tinta },
  grande: { fontSize: 30, fontWeight: '800', color: C.tinta },
  texto: { fontSize: 16, lineHeight: 23, color: C.tinta },
  pequeno: { fontSize: 13, color: C.gris },
  enlace: { fontSize: 15, fontWeight: '700', color: '#8a5c00', marginTop: 4 },
  tarjeta: { backgroundColor: C.tarjeta, borderWidth: 1, borderColor: C.linea, borderRadius: 12, padding: 16, gap: 6 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  punto: { flexDirection: 'row', gap: 10 },
  cuadro: { width: 10, height: 10, borderRadius: 2 },
  etiqueta: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  etiquetaTexto: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  boton: { backgroundColor: C.tinta, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18 },
  botonTexto: { color: '#fff', fontSize: 17, fontWeight: '700' },
  input: { backgroundColor: C.tarjeta, borderWidth: 1, borderColor: C.linea, borderRadius: 12, padding: 14, fontSize: 17, color: C.tinta },
  opcion: { backgroundColor: C.tarjeta, borderBottomWidth: 1, borderColor: C.linea, paddingVertical: 12, paddingHorizontal: 14 },
  check: { width: 26, height: 26, borderRadius: 6, borderWidth: 2, borderColor: C.linea, alignItems: 'center', justifyContent: 'center' },
  barra: { flexDirection: 'row', backgroundColor: C.tarjeta, borderTopWidth: 1, borderColor: C.linea, paddingTop: 8 },
  barraBoton: { flex: 1, alignItems: 'center', gap: 2, minHeight: 48, justifyContent: 'center' },
  barraIcono: { fontSize: 20, color: C.gris },
  barraTexto: { fontSize: 12, color: C.gris },
});
