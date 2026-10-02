// =====================================================================
//  Contenido de la presentación BiciSabana
//  Cada pregunta de "Explica tu código" tiene su propia diapositiva.
//  - answer:   ideas clave (cortas) que se muestran en la diapositiva
//  - keywords: palabras clave para guiar la exposición
//  - code:     fragmento del notebook que responde la pregunta
//  - hl / bad: líneas resaltadas (correctas / problemáticas)
//  - output:   salida en consola del fragmento
//  - visual:   ayuda visual (ver render en app.js)
//  - notes:    respuesta completa del notebook + tip para exponer (tecla N)
// =====================================================================

const EXERCISES = {
  1: { title: "Mi primer objeto: la clase y el constructor", req: "RF-01 · RF-02", icon: "🧱" },
  2: { title: "Muchos objetos, un solo molde", req: "RF-01", icon: "🍪" },
  3: { title: "Prestar con candado de seguridad", req: "RF-03 · RF-04", icon: "🔒" },
  4: { title: "El camino de regreso: devolver", req: "RF-05", icon: "↩️" },
  5: { title: "Guardar objetos en una lista", req: "RF-01 · RF-02", icon: "📋" },
  6: { title: "Contar según el estado", req: "RF-09 · Monitorear", icon: "🧮" },
  7: { title: "Buscar por código", req: "RF-07", icon: "🔎" },
  8: { title: "Seguridad: validar al estudiante", req: "RF-08 · RNF-02 · Sec", icon: "🛡️" },
  9: { title: "El mapa de la estación: lista 2D", req: "RF-10", icon: "🗺️" },
  10: { title: "Todo junto: el programa con menú", req: "RF-11 · RNF-01 · RNF-03", icon: "🎛️" }
};

// Fragmentos de código reutilizados -----------------------------------

const CODE_CLASE = `class Bicicleta:
    def __init__(self, codigo, color):
        self.codigo = codigo
        self.color = color
        self.disponible = True

    def mostrar_info(self):
        if self.disponible:
            estado = "Disponible"
        else:
            estado = "Prestada"
        print("Bicicleta", self.codigo,
              "| Color:", self.color,
              "| Estado:", estado)


b1 = Bicicleta("B01", "Rojo")
b1.mostrar_info()`;

const CODE_TRES = `b1 = Bicicleta("B01", "Rojo")
b2 = Bicicleta("B02", "Azul")
b3 = Bicicleta("B03", "Verde")

b2.color = "Amarillo"  # Laura la mandó a pintar

b1.mostrar_info()
b2.mostrar_info()
b3.mostrar_info()`;

const CODE_PRESTAR = `class Bicicleta:
    # ... __init__ y mostrar_info ...

    def prestar(self):
        if self.disponible:          # ¿nadie la tiene?
            self.disponible = False  # la marco prestada
            print("Listo: la bicicleta", self.codigo,
                  "fue prestada.")
        else:                        # ya estaba afuera
            print("Aviso: la bicicleta", self.codigo,
                  "ya está prestada.")


b1 = Bicicleta("B01", "Rojo")
b1.prestar()   # 1ª vez: se presta
b1.prestar()   # 2ª vez: solo aviso
b1.mostrar_info()`;

const CODE_PRESTAR_DEVOLVER = `def prestar(self):
    if self.disponible:
        self.disponible = False
        print("Listo: la bicicleta", self.codigo,
              "fue prestada.")
    else:
        print("Aviso: la bicicleta", self.codigo,
              "ya está prestada.")

def devolver(self):
    if not self.disponible:
        self.disponible = True
        print("Gracias: la bicicleta", self.codigo,
              "fue devuelta.")
    else:
        print("Aviso: la bicicleta", self.codigo,
              "no estaba prestada.")`;

const CODE_DEVOLVER = `def devolver(self):
    if not self.disponible:      # ¿de verdad estaba afuera?
        self.disponible = True   # vuelve a quedar libre
        print("Gracias: la bicicleta", self.codigo,
              "fue devuelta.")
    else:                        # ya estaba en la estación
        print("Aviso: la bicicleta", self.codigo,
              "no estaba prestada.")


b1 = Bicicleta("B01", "Rojo")
b1.prestar()
b1.devolver()   # devolución correcta
b1.devolver()   # devolución repetida -> aviso
b1.mostrar_info()`;

const CODE_LISTA = `bicicletas = [Bicicleta("B01", "Rojo"),
              Bicicleta("B02", "Azul"),
              Bicicleta("B03", "Verde"),
              Bicicleta("B04", "Negro"),
              Bicicleta("B05", "Blanco")]

for bici in bicicletas:      # paso por cada bici
    bici.mostrar_info()      # y le pido que se muestre

print("Total de bicicletas:", len(bicicletas))`;

const CODE_CONTAR = `bicicletas[1].prestar()   # B02
bicicletas[3].prestar()   # B04

disponibles = 0   # contadores: ANTES del for
prestadas = 0     # y empezando en cero

for bici in bicicletas:
    if bici.disponible:
        disponibles = disponibles + 1
    else:
        prestadas = prestadas + 1

total = disponibles + prestadas
porcentaje = prestadas / total * 100

print("Disponibles:", disponibles)
print("Prestadas:", prestadas)
print("Total:", total)
print("Porcentaje prestado:", porcentaje, "%")`;

const CODE_BUSCAR = `codigo_buscado = input(
    "Código de la bicicleta a buscar: ").strip().upper()
encontrada = False             # bandera abajo

for bici in bicicletas:        # recorro toda la lista
    if bici.codigo == codigo_buscado:
        bici.mostrar_info()
        encontrada = True      # subo la bandera

if not encontrada:             # ya revisé TODAS
    print("No existe una bicicleta con el código",
          codigo_buscado)`;

const CODE_ESTUDIANTE = `class Estudiante:
    def __init__(self, nombre, codigo):
        self.nombre = nombre
        self.codigo = codigo

    def codigo_valido(self):   # responde, no imprime
        if self.codigo.isdigit() and len(self.codigo) == 6:
            return True
        else:
            return False


estudiantes = [Estudiante("Ana", "202310"),
               Estudiante("Luis", "12AB34"),
               Estudiante("Camila", ""),
               Estudiante("Andrés", "123")]

for est in estudiantes:
    if est.codigo_valido():
        print(est.nombre, "puede pedir una bicicleta.")
    else:
        print(est.nombre + ": código inválido. Debe tener 6 números.")`;

const CODE_ESTACION = `estacion = []
numero = 1

for fila in range(3):              # 3 filas
    fila_bicis = []
    for puesto in range(10):       # 10 puestos por fila
        if numero < 10:
            codigo = "B0" + str(numero)
        else:
            codigo = "B" + str(numero)
        fila_bicis.append(Bicicleta(codigo, "Gris"))
        numero = numero + 1
    estacion.append(fila_bicis)

estacion[0][2].prestar()   # fila 0, puesto 2 -> B03
estacion[2][9].prestar()   # fila 2, puesto 9 -> B30`;

const CODE_MAPA = `estacion[0][2].prestar()   # B03
estacion[2][9].prestar()   # B30

print("Mapa de la estación (D = disponible, P = prestada)")
for fila in range(3):
    linea = "Fila " + str(fila + 1) + ":"
    for puesto in range(10):
        if estacion[fila][puesto].disponible:
            linea = linea + " D"
        else:
            linea = linea + " P"
    print(linea)`;

const CODE_MENU = `opcion = ""                     # vacía para que arranque
while opcion != "5":            # se repite MIENTRAS no sea 5
    print("===== BiciSabana =====")
    print("1. Ver todas las bicicletas")
    print("2. Prestar una bicicleta")
    print("3. Devolver una bicicleta")
    print("4. Ver totales")
    print("5. Salir")
    opcion = input("Elige una opción: ").strip()

    if opcion == "1":
        for bici in bicicletas:
            bici.mostrar_info()
    # ... opciones 2, 3 y 4 ...
    elif opcion == "5":
        print("Gracias por usar BiciSabana. ¡Hasta pronto!")
    else:
        print("Esa opción no existe. Escribe un número del 1 al 5.")`;

// Diapositivas --------------------------------------------------------

const SLIDES = [
  { type: "title" },
  { type: "agenda" },

  // ============================ EJERCICIO 1 ============================
  {
    ex: 1, q: 1,
    question: "¿Qué hace el constructor <code>__init__</code> y cuándo se ejecuta?",
    answer: [
      "**Llena los datos** de la bici apenas se crea: <code>codigo</code>, <code>color</code> y <code>disponible</code>.",
      "Se ejecuta **automáticamente** al escribir <code>Bicicleta(\"B01\", \"Rojo\")</code>: no hay que llamarlo aparte."
    ],
    keywords: ["constructor", "__init__", "self", "atributos", "automático"],
    code: CODE_CLASE, file: "ejercicio1.py", hl: [2, 3, 4, 5, 17],
    output: [{ t: "Bicicleta B01 | Color: Rojo | Estado: Disponible", tone: "ok" }],
    visual: {
      type: "flow",
      steps: [
        { icon: "✍️", t: 'Bicicleta("B01", "Rojo")', s: "creamos el objeto" },
        { arrow: "llama solo" },
        { icon: "⚙️", t: "__init__", s: "se ejecuta 1 vez", tone: "accent" },
        { arrow: "guarda" },
        { icon: "🗂️", t: "self.codigo · self.color · self.disponible", s: "atributos listos", tone: "ok" }
      ]
    },
    notes: "El constructor es el que llena los datos de la bici apenas la creo. Se ejecuta solo en el momento en que hago Bicicleta con el código y el color, no tengo que llamarlo aparte.",
    tip: "Señalar la línea 17 y decir: 'aquí, sin escribir __init__, ya se ejecutó'."
  },
  {
    ex: 1, q: 2,
    question: "¿Por qué <code>disponible</code> no se pide como dato y empieza en <code>True</code>?",
    answer: [
      "Toda bici que **entra al sistema llega libre**: nadie la tiene todavía.",
      "No tiene sentido pedir un dato que **siempre arranca igual** → es un **valor por defecto**."
    ],
    keywords: ["valor por defecto", "estado inicial", "parámetros", "menos errores"],
    code: CODE_CLASE, file: "ejercicio1.py", hl: [5], focus: [1, 5],
    visual: {
      type: "compare",
      left: { title: "Se pide al crear", icon: "📥", tone: "accent", items: ["codigo → \"B01\"", "color → \"Rojo\"", "Cambian en cada bici"] },
      right: { title: "Lo pone el sistema", icon: "✅", tone: "ok", items: ["disponible = True", "Igual para todas", "Bici nueva = libre"] }
    },
    notes: "Porque toda bici que entra al sistema llega libre, nadie la tiene todavía. No tiene sentido pedir ese dato si siempre arranca igual.",
    tip: "Comparar: los parámetros (codigo, color) vs. el atributo fijo (disponible)."
  },
  {
    ex: 1, q: 3,
    question: "¿Qué diferencia hay entre la clase <code>Bicicleta</code> y el objeto que creaste?",
    answer: [
      "La **clase es el plano**: dice qué datos y qué métodos tendrá cualquier bici.",
      "El **objeto es la bici de verdad**: en este caso <code>b1</code>, la B01 roja."
    ],
    keywords: ["clase = molde", "objeto = instancia", "plano", "b1"],
    code: CODE_CLASE, file: "ejercicio1.py", hl: [1, 17],
    visual: {
      type: "mold",
      cls: "Bicicleta",
      attrs: ["codigo", "color", "disponible"],
      methods: ["mostrar_info()"],
      call: 'Bicicleta("B01", "Rojo")',
      objs: [{ name: "b1", code: "B01", color: "Rojo", hex: "#ef4444" }]
    },
    notes: "La clase es el plano, dice qué datos y qué métodos va a tener cualquier bici. El objeto es la bici de verdad, en este caso la B01 roja.",
    tip: "Usar la analogía: plano de una bicicleta (clase) vs. la bicicleta real (objeto)."
  },

  // ============================ EJERCICIO 2 ============================
  {
    ex: 2, q: 1,
    question: "Cuando cambiaste el color de <code>B02</code>, ¿por qué no cambió el de <code>B01</code>?",
    answer: [
      "**Cada objeto guarda sus propios datos**: son independientes.",
      "<code>b2.color = \"Amarillo\"</code> solo toca a <code>b2</code>; la B01 sigue igual."
    ],
    keywords: ["independencia", "atributos propios", "un molde, muchos objetos", "galletas 🍪"],
    code: CODE_TRES, file: "ejercicio2.py", hl: [5],
    output: [
      { t: "Bicicleta B01 | Color: Rojo | Estado: Disponible" },
      { t: "Bicicleta B02 | Color: Amarillo | Estado: Disponible", tone: "accent" },
      { t: "Bicicleta B03 | Color: Verde | Estado: Disponible" }
    ],
    visual: {
      type: "objects",
      items: [
        { name: "b1", code: "B01", color: "Rojo", hex: "#ef4444" },
        { name: "b2", code: "B02", color: "Amarillo", hex: "#facc15", was: "Azul" },
        { name: "b3", code: "B03", color: "Verde", hex: "#22c55e" }
      ]
    },
    notes: "Porque cada objeto guarda sus propios datos. Cuando cambié el color de b2 solo toqué esa bici, la B01 sigue igual.",
    tip: "Analogía: con un molde se hacen muchas galletas; si decoras una, las demás no cambian."
  },
  {
    ex: 2, q: 2,
    question: "¿Cuántas veces se ejecutó el constructor en tu código? ¿Cómo lo sabes?",
    answer: [
      "**Tres veces**, una por cada bici creada.",
      "Cada <code>Bicicleta(...)</code> nuevo = **una llamada** a <code>__init__</code>. Cambiar el color **no** lo vuelve a ejecutar."
    ],
    keywords: ["3 objetos", "3 llamadas", "instanciar", "__init__"],
    code: CODE_TRES, file: "ejercicio2.py", hl: [1, 2, 3], bad: [],
    visual: {
      type: "counter",
      big: "3×",
      label: "se ejecutó __init__",
      rows: [
        { t: 'Bicicleta("B01", "Rojo")', s: "__init__ #1", tone: "ok" },
        { t: 'Bicicleta("B02", "Azul")', s: "__init__ #2", tone: "ok" },
        { t: 'Bicicleta("B03", "Verde")', s: "__init__ #3", tone: "ok" },
        { t: 'b2.color = "Amarillo"', s: "no llama a __init__", tone: "muted" }
      ]
    },
    notes: "Tres veces, una por cada bici que creé. Cada vez que creo una bici nueva con la clase se corre el constructor.",
    tip: "Contar en voz alta las líneas 1, 2 y 3 del código."
  },

  // ============================ EJERCICIO 3 ============================
  {
    ex: 3, q: 1,
    question: "¿Qué parte de tu código evita que una bicicleta se preste dos veces?",
    answer: [
      "El **<code>if self.disponible</code>** revisa el estado **antes** de cambiar nada.",
      "Si ya está prestada, se va por el **<code>else</code>**: solo muestra el aviso."
    ],
    keywords: ["if / else", "candado", "validar antes de cambiar", "semáforo 🚦"],
    code: CODE_PRESTAR, file: "ejercicio3.py", hl: [5, 6, 9],
    output: [
      { t: "Listo: la bicicleta B01 fue prestada.", tone: "ok" },
      { t: "Aviso: la bicicleta B01 ya está prestada.", tone: "warn" },
      { t: "Bicicleta B01 | Color: Rojo | Estado: Prestada" }
    ],
    visual: {
      type: "flow",
      steps: [
        { icon: "🟢", t: "Disponible", s: "disponible = True", tone: "ok" },
        { arrow: "prestar()" },
        { icon: "🔴", t: "Prestada", s: "disponible = False", tone: "bad" },
        { arrow: "prestar() otra vez" },
        { icon: "⚠️", t: "Aviso", s: "no cambia nada", tone: "warn" }
      ]
    },
    notes: "El if que revisa si la bici está disponible antes de cambiar nada. Si ya está prestada se va por el else y solo muestra el aviso.",
    tip: "Analogía del semáforo: en verde pasa y se pone en rojo; en rojo no deja pasar."
  },
  {
    ex: 3, q: 2,
    question: "¿Qué problema del cuaderno de Laura resuelve este método?",
    answer: [
      "En el cuaderno **no se sabía si una bici ya estaba afuera**.",
      "Se podía **anotar dos veces** el préstamo de la misma bici. El sistema **ya no lo permite**."
    ],
    keywords: ["préstamo duplicado", "estado confiable", "cuaderno 📒 → sistema 💻", "RF-04"],
    code: CODE_PRESTAR, file: "ejercicio3.py", hl: [15, 16], focus: [13, 17],
    output: [
      { t: "Listo: la bicicleta B01 fue prestada.", tone: "ok" },
      { t: "Aviso: la bicicleta B01 ya está prestada.", tone: "warn" }
    ],
    visual: {
      type: "compare",
      left: { title: "Cuaderno de Laura", icon: "📒", tone: "bad", items: ["B01 → Ana ✔", "B01 → Juan ✔ (¡duplicado!)", "¿Quién la tiene realmente?"] },
      right: { title: "Sistema BiciSabana", icon: "💻", tone: "ok", items: ["B01 → prestada ✔", "2º intento → Aviso ⚠", "El estado siempre es claro"] }
    },
    notes: "En el cuaderno de Laura no había forma de saber si una bici ya estaba afuera, entonces se podía anotar el préstamo de la misma bici dos veces. Con esto el sistema no lo permite.",
    tip: "Contar la historia: dos personas anotadas con la misma bici en el cuaderno."
  },
  {
    ex: 3, q: 3,
    question: "¿Qué pasaría si quitaras el <code>if</code> y dejaras solo <code>self.disponible = False</code>?",
    answer: [
      "Se podría **prestar la misma bici una y otra vez** sin ningún aviso.",
      "El sistema diría **\"sí\"** aunque otra persona ya la tenga → datos falsos."
    ],
    keywords: ["sin validación", "error silencioso", "datos inconsistentes", "por qué existe el if"],
    code: `# ❌ Versión SIN candado (hipotética)
def prestar(self):
    self.disponible = False
    print("Listo: la bicicleta", self.codigo,
          "fue prestada.")

# ✅ Nuestra versión
def prestar(self):
    if self.disponible:
        self.disponible = False
        print("Listo: la bicicleta", self.codigo,
              "fue prestada.")
    else:
        print("Aviso: la bicicleta", self.codigo,
              "ya está prestada.")`,
    file: "comparacion.py", hl: [9, 13], bad: [3, 4, 5],
    visual: {
      type: "terminal",
      title: "Sin el if: b1.prestar() dos veces",
      lines: [
        { t: ">>> b1.prestar()", tone: "muted" },
        { t: "Listo: la bicicleta B01 fue prestada.", tone: "ok" },
        { t: ">>> b1.prestar()", tone: "muted" },
        { t: "Listo: la bicicleta B01 fue prestada.   ← ¡otra vez!", tone: "bad" }
      ]
    },
    notes: "Se podría prestar la misma bici una y otra vez sin ningún aviso, el sistema diría que sí aunque ya la tenga otra persona.",
    tip: "Mostrar las líneas rojas (sin if) contra las verdes (con if)."
  },

  // ============================ EJERCICIO 4 ============================
  {
    ex: 4, q: 1,
    question: "¿En qué se parecen y en qué se diferencian <code>prestar()</code> y <code>devolver()</code>?",
    answer: [
      "**Se parecen:** los dos revisan el estado antes de tocarlo y avisan si no se puede.",
      "**Se diferencian:** <code>prestar</code> pone <code>False</code>, <code>devolver</code> lo regresa a <code>True</code>. Hacen lo **contrario**."
    ],
    keywords: ["métodos opuestos", "misma estructura if/else", "True ⇄ False", "not"],
    code: CODE_PRESTAR_DEVOLVER, file: "ejercicio4.py", hl: [2, 3, 11, 12],
    visual: {
      type: "cycle",
      a: { icon: "🟢", t: "Disponible", s: "True", tone: "ok" },
      b: { icon: "🔴", t: "Prestada", s: "False", tone: "bad" },
      top: "prestar()",
      bottom: "devolver()",
      common: "En común: if / else · revisan antes de cambiar · avisan si no se puede"
    },
    notes: "Se parecen en que los dos revisan el estado antes de tocarlo y avisan cuando no se puede. La diferencia es que prestar pone disponible en False y devolver lo regresa a True, hacen lo contrario.",
    tip: "Es el mismo semáforo, pero al revés: solo vuelve a verde si estaba en rojo."
  },
  {
    ex: 4, q: 2,
    question: "¿Por qué es importante avisar cuando alguien intenta devolver una bicicleta que no estaba prestada?",
    answer: [
      "Si no avisa, **nadie se entera del error**.",
      "Puede ser un **código equivocado** o una bici que **nunca salió** → el aviso protege los datos."
    ],
    keywords: ["retroalimentación", "detectar errores", "integridad de datos", "else"],
    code: CODE_DEVOLVER, file: "ejercicio4.py", hl: [6, 7, 8], focus: [1, 15],
    output: [
      { t: "Listo: la bicicleta B01 fue prestada.", tone: "ok" },
      { t: "Gracias: la bicicleta B01 fue devuelta.", tone: "ok" },
      { t: "Aviso: la bicicleta B01 no estaba prestada.", tone: "warn" },
      { t: "Bicicleta B01 | Color: Rojo | Estado: Disponible" }
    ],
    visual: {
      type: "flow",
      steps: [
        { icon: "↩️", t: "Devolución rara", s: "bici ya estaba libre", tone: "warn" },
        { arrow: "else" },
        { icon: "📢", t: "Aviso", s: "el usuario se entera", tone: "accent" },
        { arrow: "" },
        { icon: "🛡️", t: "Datos intactos", s: "no se daña el estado", tone: "ok" }
      ]
    },
    notes: "Porque si no avisa nadie se entera del error. Puede ser que se equivocaron de código o que están devolviendo una bici que nunca salió, y así los datos no se dañan.",
    tip: "Dar ejemplos: 'me equivoqué de código' o 'esa bici nunca salió'."
  },

  // ============================ EJERCICIO 5 ============================
  {
    ex: 5, q: 1,
    question: "¿Qué ventaja tiene usar una lista en vez de crear <code>b1</code>, <code>b2</code>, <code>b3</code>… cuando Laura tiene 30 bicicletas?",
    answer: [
      "**No hay que crear 30 variables** a mano.",
      "Con **un solo <code>for</code>** se recorren todas, y si llegan bicis nuevas **solo se agregan** a la lista."
    ],
    keywords: ["lista", "escalabilidad", "for", "len()", "menos código"],
    code: CODE_LISTA, file: "ejercicio5.py", hl: [1, 7, 8, 10],
    output: [
      { t: "Bicicleta B01 | Color: Rojo | Estado: Disponible" },
      { t: "Bicicleta B02 | Color: Azul | Estado: Disponible" },
      { t: "...", tone: "muted" },
      { t: "Total de bicicletas: 5", tone: "accent" }
    ],
    visual: {
      type: "compare",
      left: { title: "Sin lista", icon: "😩", tone: "bad", items: ["b1, b2, b3, … b30", "30 variables", "30 líneas de mostrar_info()"] },
      right: { title: "Con lista", icon: "😎", tone: "ok", items: ["bicicletas = [ … ]", "1 variable", "1 for para todas · len() las cuenta"] }
    },
    notes: "No tengo que crear 30 variables a mano, y con un solo for las recorro todas. Si llegan bicis nuevas solo las agrego a la lista.",
    tip: "Preguntar al público: ¿se imaginan escribir b1.mostrar_info() 30 veces?"
  },
  {
    ex: 5, q: 2,
    question: "En tu <code>for</code>, ¿qué contiene la variable en cada vuelta: un texto o un objeto? ¿Cómo lo sabes?",
    answer: [
      "Contiene **un objeto**: una bici completa.",
      "Lo sabemos porque le podemos pedir <code>bici.mostrar_info()</code> o leer <code>bici.codigo</code>; **un texto no tiene eso**."
    ],
    keywords: ["objeto", "iteración", "bici.atributo", "bici.método()"],
    code: CODE_LISTA, file: "ejercicio5.py", hl: [7, 8],
    visual: {
      type: "iter",
      varName: "bici",
      items: ["B01", "B02", "B03", "B04", "B05"],
      colors: ["#ef4444", "#3b82f6", "#22c55e", "#64748b", "#e2e8f0"],
      caption: "En cada vuelta, <code>bici</code> apunta a un objeto <code>Bicicleta</code> → tiene <code>.codigo</code>, <code>.color</code>, <code>.mostrar_info()</code>"
    },
    notes: "Un objeto, una bici completa. Lo sé porque le puedo pedir que se muestre o leer su código, y eso un texto no lo tiene.",
    tip: "Seguir con el dedo la animación: la variable 'bici' va saltando de objeto en objeto."
  },

  // ============================ EJERCICIO 6 ============================
  {
    ex: 6, q: 1,
    question: "¿Por qué los contadores deben empezar en 0 y crearse <strong>antes</strong> del <code>for</code>?",
    answer: [
      "Empiezan en **0** porque todavía **no se ha contado nada**.",
      "Van **antes** del <code>for</code>: si se crean adentro, **se reinician en cada vuelta** y nunca suman bien."
    ],
    keywords: ["contador", "acumulador", "inicializar en 0", "fuera del ciclo"],
    code: CODE_CONTAR, file: "ejercicio6.py", hl: [4, 5, 9, 11], focus: [1, 11],
    visual: {
      type: "compare",
      left: { title: "Dentro del for", icon: "❌", tone: "bad", items: ["vuelta 1: 0 → 1", "vuelta 2: 0 → 1", "vuelta 3: 0 → 1", "Resultado: siempre 1"] },
      right: { title: "Antes del for", icon: "✅", tone: "ok", items: ["vuelta 1: 0 → 1", "vuelta 2: 1 → 2", "vuelta 3: 2 → 3", "Resultado: acumula bien"] }
    },
    notes: "Empiezan en 0 porque todavía no he contado nada. Y van antes del for porque si los creo adentro se reinician en cada vuelta y nunca suman bien.",
    tip: "Analogía: dos pilas de sombrillas; cada vez que revisas una, sumas 1 a la pila correcta."
  },
  {
    ex: 6, q: 2,
    question: "¿Cómo usarías estos números para convencer a Laura de que el sistema funciona?",
    answer: [
      "**Disponibles + prestadas = total** siempre → **no se pierde ninguna** bici.",
      "El **porcentaje** muestra de una cuánto se está usando el servicio."
    ],
    keywords: ["comprobación", "monitorear (DevSecOps)", "RF-09", "porcentaje de uso"],
    code: CODE_CONTAR, file: "ejercicio6.py", hl: [13, 14, 18, 19], focus: [7, 19],
    output: [
      { t: "Listo: la bicicleta B02 fue prestada.", tone: "ok" },
      { t: "Listo: la bicicleta B04 fue prestada.", tone: "ok" },
      { t: "Disponibles: 3" },
      { t: "Prestadas: 2" },
      { t: "Total: 5", tone: "accent" },
      { t: "Porcentaje prestado: 40.0 %", tone: "accent" }
    ],
    visual: {
      type: "stats",
      items: [
        { n: "3", l: "Disponibles", tone: "ok" },
        { n: "+", l: "", tone: "op" },
        { n: "2", l: "Prestadas", tone: "bad" },
        { n: "=", l: "", tone: "op" },
        { n: "5", l: "Total ✔", tone: "accent" }
      ],
      bar: { pct: 40, label: "Porcentaje prestado" }
    },
    notes: "Le mostraría que disponibles más prestadas siempre da el total de bicis, o sea que no se pierde ninguna. Y con el porcentaje ve de una cuánto se está usando el servicio.",
    tip: "Recalcar: esto es la etapa 8 de DevSecOps — Monitorear."
  },

  // ============================ EJERCICIO 7 ============================
  {
    ex: 7, q: 1,
    question: "¿Para qué sirve la bandera <code>encontrada</code>?",
    answer: [
      "Sirve para **recordar si en algún momento se encontró** la bici.",
      "Arranca en <code>False</code> y **solo cambia a <code>True</code>** si alguna coincide."
    ],
    keywords: ["bandera", "booleano", "False → True", "memoria del recorrido"],
    code: CODE_BUSCAR, file: "ejercicio7.py", hl: [3, 8],
    visual: {
      type: "flag",
      items: ["B01", "B02", "B03", "B04", "B05"],
      target: "B03",
      caption: 'Buscando <code>"B03"</code>: la bandera sube cuando hay coincidencia y se queda arriba'
    },
    notes: "Para acordarme si en algún momento encontré la bici. Arranca en False y solo cambia a True si alguna coincide.",
    tip: "Analogía del cartero: revisa buzón por buzón; levanta la bandera cuando encuentra la dirección."
  },
  {
    ex: 7, q: 2,
    question: "¿Por qué el mensaje de «no existe» va <strong>después</strong> del <code>for</code> y no dentro de él?",
    answer: [
      "Dentro del <code>for</code> saldría el mensaje **por cada bici que no coincide** (muchas veces).",
      "Solo **cuando ya se revisaron todas** se puede afirmar que no existe."
    ],
    keywords: ["después del ciclo", "revisar todo primero", "if not encontrada", "un solo mensaje"],
    code: CODE_BUSCAR, file: "ejercicio7.py", hl: [10, 11, 12],
    visual: {
      type: "compare",
      left: { title: "Dentro del for (B03)", icon: "❌", tone: "bad", items: ["No existe… (B01)", "No existe… (B02)", "Bicicleta B03 ✔", "No existe… (B04) · (B05)"] },
      right: { title: "Después del for", icon: "✅", tone: "ok", items: ["Si la encuentra: la muestra", "Si no: 1 solo mensaje", "\"No existe una bicicleta con el código B99\""] }
    },
    notes: "Porque dentro del for saldría el mensaje por cada bici que no coincide, o sea muchas veces. Solo cuando ya revisé todas puedo decir que no existe.",
    tip: "El cartero solo devuelve la carta después de recorrer TODA la calle."
  },
  {
    ex: 7, q: 3,
    question: "¿Qué pasa si el usuario escribe <code>b03</code> en minúscula? ¿Cómo podrías mejorarlo?",
    answer: [
      "No la encontraría: para Python **<code>b03</code> y <code>B03</code> son distintos**.",
      "Mejora aplicada: <code>.strip()</code> quita espacios y <code>.upper()</code> pasa a **mayúscula**."
    ],
    keywords: ["case-sensitive", "normalizar entrada", ".strip()", ".upper()"],
    code: CODE_BUSCAR, file: "ejercicio7.py", hl: [1, 2, 6], focus: [1, 8],
    visual: {
      type: "flow",
      steps: [
        { icon: "⌨️", t: '"  b03 "', s: "lo que escribe", tone: "warn" },
        { arrow: ".strip()" },
        { icon: "✂️", t: '"b03"', s: "sin espacios" },
        { arrow: ".upper()" },
        { icon: "🔠", t: '"B03"', s: "¡coincide! ✔", tone: "ok" }
      ]
    },
    notes: "No la encontraría, porque para Python b03 y B03 son distintos. Por eso al texto que escribe el usuario le apliqué upper, que lo pasa a mayúscula, y le quité los espacios con strip. Así funciona igual.",
    tip: "Hacer la demostración: escribir ' b03 ' y mostrar que igual la encuentra."
  },

  // ============================ EJERCICIO 8 ============================
  {
    ex: 8, q: 1,
    question: "¿Por qué este método usa <code>return</code> en vez de <code>print</code>?",
    answer: [
      "El método **solo responde** si el código sirve o no (<code>True</code>/<code>False</code>).",
      "**El programa decide** qué mostrar → se puede usar dentro de un <code>if</code> (como en el menú) sin imprimir de más."
    ],
    keywords: ["return", "True / False", "reutilizable", "separar responsabilidades"],
    code: CODE_ESTUDIANTE, file: "ejercicio8.py", hl: [6, 8, 10, 19],
    visual: {
      type: "compare",
      left: { title: "Con print", icon: "🖨️", tone: "bad", items: ["Solo muestra texto", "No se puede usar en un if", "Imprime aunque no se quiera"] },
      right: { title: "Con return", icon: "↩️", tone: "ok", items: ["Devuelve True / False", "if est.codigo_valido(): …", "Cada parte decide su mensaje"] }
    },
    notes: "Porque el método solo tiene que responder si el código sirve o no, y el que decide qué mensaje mostrar es el programa. Así lo puedo meter en un if, por ejemplo en el menú, sin que imprima cosas de más.",
    tip: "Analogía del portero: no te abre la puerta, solo responde 'válido' o 'no válido'."
  },
  {
    ex: 8, q: 2,
    question: "¿Qué riesgo del caso de Laura evita esta validación?",
    answer: [
      "Evita que alguien pida una bici con un **código inventado o mal escrito**.",
      "Sin validación, después **no se sabría quién tiene la bici**."
    ],
    keywords: ["seguridad (Sec)", "trazabilidad", "RF-08 · RNF-02", "isdigit() + len()"],
    code: CODE_ESTUDIANTE, file: "ejercicio8.py", hl: [7, 13, 14, 15, 16], focus: [6, 22],
    visual: {
      type: "checks",
      rows: [
        { name: "Ana", code: "202310", ok: true, why: "6 números" },
        { name: "Luis", code: "12AB34", ok: false, why: "tiene letras" },
        { name: "Camila", code: "\"\"", ok: false, why: "vacío" },
        { name: "Andrés", code: "123", ok: false, why: "muy corto" }
      ]
    },
    output: [
      { t: "Ana puede pedir una bicicleta.", tone: "ok" },
      { t: "Luis: código inválido. Debe tener 6 números.", tone: "warn" },
      { t: "Camila: código inválido. Debe tener 6 números.", tone: "warn" },
      { t: "Andrés: código inválido. Debe tener 6 números.", tone: "warn" }
    ],
    notes: "Que alguien pida una bici con un código inventado o mal escrito y después no se sepa quién la tiene.",
    tip: "Recorrer la tabla: 1 válido y 3 casos inválidos distintos (letras, vacío, corto)."
  },
  {
    ex: 8, q: 3,
    question: "Menciona otros dos datos que un usuario podría escribir mal y que tu sistema debería validar.",
    answer: [
      "**El código de la bicicleta:** que exista y esté bien escrito.",
      "**La opción del menú:** que sea un número que sí exista (1 a 5)."
    ],
    keywords: ["validar entradas", "nunca confiar en el input", "RNF", "programa robusto"],
    code: `# 1) Código de la bicicleta (opciones 2 y 3)
codigo_bici = input("Código de la bicicleta: ").strip().upper()
encontrada = False
for bici in bicicletas:
    if bici.codigo == codigo_bici:
        bici.prestar()
        encontrada = True
if not encontrada:
    print("No existe una bicicleta con el código", codigo_bici)

# 2) Opción del menú
opcion = input("Elige una opción: ").strip()
# ... if / elif para 1 a 5 ...
else:
    print("Esa opción no existe. Escribe un número del 1 al 5.")`,
    file: "ejercicio10.py", hl: [2, 8, 9, 12, 14, 15],
    visual: {
      type: "cards",
      items: [
        { icon: "🚲", title: "Código de bicicleta", text: "¿Existe en la lista? · mayúsculas con .upper() · sin espacios con .strip()" },
        { icon: "🎛️", title: "Opción del menú", text: "¿Está entre 1 y 5? · si no, mensaje amable y el menú vuelve a salir" }
      ]
    },
    notes: "El código de la bicicleta, que exista y esté bien escrito, y la opción del menú, que sea un número que sí exista.",
    tip: "Conectar con el ejercicio 10: ambas validaciones ya están implementadas en el menú."
  },

  // ============================ EJERCICIO 9 ============================
  {
    ex: 9, q: 1,
    question: "¿Qué significa <code>estacion[2][9]</code>? ¿Por qué es la bicicleta B30?",
    answer: [
      "Es **fila 2, puesto 9**; como se cuenta **desde 0**, es la **3ª fila y el 10º puesto**.",
      "Antes van **20 bicis** de las dos primeras filas → **2 × 10 + 9 + 1 = 30**."
    ],
    keywords: ["lista 2D", "[fila][columna]", "índice desde 0", "2 × 10 + 9 + 1"],
    code: CODE_ESTACION, file: "ejercicio9.py", hl: [16], focus: [1, 16],
    visual: {
      type: "grid", rows: 3, cols: 10, mode: "codes",
      prestadas: [], focus: [2, 9],
      caption: "<code>estacion[2][9]</code> → fila 2 (3ª) · puesto 9 (10º) → <strong>B30</strong>"
    },
    notes: "Es la fila 2 y el puesto 9, pero como se cuenta desde 0 eso es la tercera fila y el décimo puesto. Antes van 20 bicis de las dos primeras filas, entonces esa es la número 30.",
    tip: "Analogía del tablero de ajedrez: cada casilla se ubica con fila y columna."
  },
  {
    ex: 9, q: 2,
    question: "¿Cómo le ayuda este mapa a Laura con el problema de las bicicletas «perdidas»?",
    answer: [
      "Ve **de un vistazo** qué bicis están afuera, **sin ir a contar**.",
      "Si una sale prestada y no aparece, **sabe exactamente cuál buscar**."
    ],
    keywords: ["visualización", "RF-10", "dos for anidados", "D = disponible · P = prestada"],
    code: CODE_MAPA, file: "ejercicio9.py", hl: [5, 7, 8, 9, 11], focus: [1, 12],
    output: [
      { t: "Listo: la bicicleta B03 fue prestada.", tone: "ok" },
      { t: "Listo: la bicicleta B30 fue prestada.", tone: "ok" },
      { t: "Fila 1: D D P D D D D D D D" },
      { t: "Fila 2: D D D D D D D D D D" },
      { t: "Fila 3: D D D D D D D D D P" }
    ],
    visual: {
      type: "grid", rows: 3, cols: 10, mode: "map",
      prestadas: [[0, 2], [2, 9]],
      caption: "🔴 P = prestada · 🟢 D = disponible → Laura busca <strong>B03</strong> y <strong>B30</strong>"
    },
    notes: "Con el mapa Laura ve de un vistazo qué bicis están afuera sin tener que ir a contar. Si una sale prestada y no aparece, sabe exactamente cuál buscar.",
    tip: "Señalar las dos P en el mapa: 'estas son las únicas que hay que buscar'."
  },

  // ============================ EJERCICIO 10 ===========================
  {
    ex: 10, q: 1,
    question: "¿Por qué el <code>while</code> sigue repitiéndose y cuándo se detiene?",
    answer: [
      "Se repite **mientras** la opción sea **diferente de <code>\"5\"</code>**.",
      "Cuando el usuario escribe **5**, la condición deja de cumplirse y el programa **sale**."
    ],
    keywords: ["while", "condición", "opcion != \"5\"", "ciclo del menú"],
    code: CODE_MENU, file: "ejercicio10.py", hl: [1, 2, 9, 15, 16],
    visual: {
      type: "loop",
      steps: [
        { icon: "📋", t: "Mostrar menú" },
        { icon: "⌨️", t: "Leer opción" },
        { icon: "⚙️", t: "Ejecutar opción" },
        { icon: "❓", t: 'opcion != "5"?', tone: "accent" }
      ],
      back: "Sí → vuelve a mostrar el menú",
      exit: "No (escribió 5) → ¡Hasta pronto! 👋"
    },
    notes: "Se repite mientras la opción sea diferente de 5. Cuando el usuario escribe 5 la condición ya no se cumple y el programa sale.",
    tip: "Analogía del control remoto: el televisor sigue encendido hasta que presionas 'apagar'."
  },
  {
    ex: 10, q: 2,
    question: "¿Qué hace tu programa si el usuario escribe <code>9</code> o <code>hola</code> en el menú? ¿Qué requerimiento cumple eso?",
    answer: [
      "Muestra que **esa opción no existe** y el **menú vuelve a aparecer**: **no se cae**.",
      "Cumple los **RNF**: el programa **nunca se detiene con error**."
    ],
    keywords: ["else atrapa todo", "robustez", "RNF-01 · RNF-03", "mensaje amable"],
    code: CODE_MENU, file: "ejercicio10.py", hl: [17, 18],
    visual: {
      type: "terminal",
      title: "Prueba con entradas inválidas",
      lines: [
        { t: "Elige una opción: 9", tone: "muted" },
        { t: "Esa opción no existe. Escribe un número del 1 al 5.", tone: "warn" },
        { t: "===== BiciSabana =====", tone: "accent" },
        { t: "Elige una opción: hola", tone: "muted" },
        { t: "Esa opción no existe. Escribe un número del 1 al 5.", tone: "warn" },
        { t: "===== BiciSabana =====   ← sigue funcionando ✔", tone: "ok" }
      ]
    },
    notes: "Sale un mensaje diciendo que esa opción no existe y el menú vuelve a aparecer, no se cae. Eso cumple lo que piden los RNF de que el programa no se detenga con error.",
    tip: "Si hay tiempo, hacer la demo en vivo escribiendo 'hola'."
  },
  {
    ex: 10, q: 3,
    question: "¿Qué opción agregarías en el siguiente sprint y qué requerimiento nuevo cumpliría?",
    answer: [
      "Agregaríamos **\"Buscar por código\"**, que **ya está hecha** en el ejercicio 7.",
      "Con eso se cumpliría el **RF-07**."
    ],
    keywords: ["siguiente sprint", "RF-07", "reutilizar código", "mejora incremental"],
    code: `# 🚀 Propuesta para el siguiente sprint
elif opcion == "6":   # Buscar por código (RF-07)
    codigo_buscado = input("Código a buscar: ").strip().upper()
    encontrada = False
    for bici in bicicletas:
        if bici.codigo == codigo_buscado:
            bici.mostrar_info()
            encontrada = True
    if not encontrada:
        print("No existe una bicicleta con el código",
              codigo_buscado)`,
    file: "sprint2.py", hl: [2],
    visual: {
      type: "menu",
      title: "===== BiciSabana =====",
      items: ["1. Ver todas las bicicletas", "2. Prestar una bicicleta", "3. Devolver una bicicleta", "4. Ver totales", "5. Salir"],
      added: "6. Buscar por código  ← RF-07 (ejercicio 7)"
    },
    notes: "Agregaría la opción de buscar por código, que ya la tengo del ejercicio 7, y con eso se cumpliría el RF-07.",
    tip: "Mencionar también el reto del proyecto: 'Ver disponibles' (RF-06) y 'Ver mapa' (RF-10)."
  },

  { type: "end" }
];
