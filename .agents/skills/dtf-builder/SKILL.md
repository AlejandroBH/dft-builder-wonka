---
name: DTF Builder - React 19 + Vite + Fabric.js Senior Developer
description: Skill para desarrollar en el proyecto DTF Gang Sheet Builder siguiendo la arquitectura, tecnologías y convenciones ya establecidas.
---

# DTF Builder — Guía de Desarrollo Senior

Este skill define las convenciones, arquitectura y patrones de código del proyecto **DTF Gang Sheet Builder**. Toda contribución DEBE adherirse estrictamente a estas guías.

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 19 | UI con componentes funcionales |
| **TypeScript** | ~5.9 (strict) | Tipado estricto en todo el proyecto |
| **Vite** | 7 | Bundler y dev server |
| **TailwindCSS** | 4 | Estilos utility-first (importado como plugin Vite) |
| **Fabric.js** | 7 | Manipulación del canvas 2D |
| **jsPDF** | 4 | Generación de PDFs |
| **Zustand** | 5 | Estado global reactivo |

> [!IMPORTANT]
> **NO** instalar librerías adicionales sin justificación explícita. El stack actual cubre todas las necesidades del proyecto.

---

## Arquitectura de Carpetas

```
src/
├── components/          # Componentes React organizados por dominio
│   ├── canvas/          # CanvasEditor, GridOverlay
│   ├── layout/          # EditorLayout (composición principal)
│   ├── sidebar/         # LeftPanel, RightPanel, AssetLibrary
│   └── toolbar/         # TopToolbar
├── constants/           # Constantes tipadas y configuración por defecto
│   └── index.ts
├── hooks/               # Custom hooks (lógica reutilizable)
│   └── useFabricCanvas.ts
├── store/               # Stores Zustand
│   └── useEditorStore.ts
├── types/               # Interfaces y tipos TypeScript centralizados
│   └── index.ts
├── utils/               # Funciones utilitarias puras
│   ├── exportPdf.ts
│   ├── exportPng.ts
│   └── imageUpload.ts
├── assets/              # Assets estáticos
├── App.tsx              # Componente raíz (solo renderiza EditorLayout)
├── main.tsx             # Entry point con StrictMode
└── index.css            # Estilos globales + importación de Tailwind
```

### Reglas de organización

1. **Componentes**: Agrupar por dominio funcional (`canvas/`, `sidebar/`, `toolbar/`, `layout/`). Un archivo por componente.
2. **Hooks**: Prefijo `use`. Un hook por archivo. Retornar un objeto de acciones con interfaz tipada.
3. **Store**: Un archivo por store. Prefijo `use` + `Store` (ej: `useEditorStore`).
4. **Types**: Centralizar en `types/index.ts`. Exportar solo `interface` y `type`.
5. **Utils**: Funciones puras, sin estado ni efectos secundarios. Un archivo por contexto funcional.
6. **Constants**: Valores inmutables con `const` y JSDoc descriptivo.

---

## Patrones de Código

### Componentes React

```tsx
// ✅ Componente funcional con props tipadas mediante interface
interface MiComponenteProps {
    canvasActions: FabricCanvasActions | null;
}

export default function MiComponente({ canvasActions }: MiComponenteProps) {
    // Zustand: selectores atómicos (un selector por valor)
    const valor = useEditorStore((s) => s.valor);

    // Callbacks con useCallback
    const handleAction = useCallback(() => {
        // lógica
    }, [dependencias]);

    return (
        <div className="bg-gray-900 border border-gray-700 ...">
            {/* Tailwind utility classes directamente */}
        </div>
    );
}
```

**Reglas:**
- Usar `export default function` (no arrow functions para componentes exportados)
- Props siempre con `interface` declarada arriba del componente
- Selectores Zustand: **siempre atómicos** `(s) => s.campo`, nunca desestructurar el store completo
- Memoizar handlers con `useCallback` cuando se pasan como props
- SVG inline para iconos (no usar librerías de iconos)

### Custom Hooks

```tsx
// ✅ Interfaz de acciones exportada
export interface MiHookActions {
    accion1: () => void;
    accion2: (param: string) => void;
}

export function useMiHook(ref: React.RefObject<HTMLElement | null>): MiHookActions {
    const fabricRef = useRef<TipoInterno | null>(null);

    // Selectores atómicos del store
    const config = useEditorStore((s) => s.sheetConfig);
    const addObject = useEditorStore((s) => s.addObject);

    // Acciones con useCallback
    const accion1 = useCallback(() => {
        const instancia = fabricRef.current;
        if (!instancia) return;
        // lógica...
    }, [dependencias]);

    // Retornar objeto de acciones
    return { accion1, accion2 };
}
```

**Reglas:**
- Exportar una **interface de acciones** junto al hook
- Usar `useRef` para referencias a instancias imperativas (ej: `fabric.Canvas`)
- `useEffect` con cleanup para inicializar/destruir recursos
- Acceder al store fuera de React con `useEditorStore.getState()` (dentro de event listeners)

### Store Zustand

```tsx
import { create } from 'zustand';

interface MiState {
    // Datos
    dato: TipoDato;

    // Acciones
    setDato: (d: Partial<TipoDato>) => void;
    toggleBool: () => void;
}

export const useMiStore = create<MiState>((set, get) => ({
    dato: VALOR_DEFAULT,

    setDato: (d) =>
        set((state) => ({
            dato: { ...state.dato, ...d },
        })),

    toggleBool: () =>
        set((state) => ({
            settings: { ...state.settings, campo: !state.settings.campo },
        })),
}));
```

**Reglas:**
- Interfaz del state definida dentro del mismo archivo
- Valores por defecto importados desde `constants/`
- Usar `set` con función para estados derivados del anterior
- Usar `get()` para acceder al estado actual dentro de acciones
- Clamping/validación directamente en la acción (ej: `Math.min/Math.max` para zoom)

### Utilidades

```tsx
import { MI_CONSTANTE } from '../constants';
import type { MiTipo } from '../types';

/**
 * Descripción clara de qué hace la función.
 * Incluir detalles técnicos relevantes.
 */
export function miFuncion(param: MiTipo): ResultType {
    // Lógica pura, sin side effects
    return resultado;
}
```

**Reglas:**
- **JSDoc obligatorio** en todas las funciones exportadas
- Funciones puras: sin `useState`, `useEffect`, ni acceso al DOM (excepto `imageUpload.ts` y funciones de descarga)
- Importar constantes desde `constants/`, tipos desde `types/`
- Un contexto funcional por archivo (export, upload, etc.)

### Constantes

```tsx
import type { SheetConfig } from '../types';

/** Descripción de la constante con JSDoc */
export const MI_CONSTANTE: TipoExplicito = valor;

/** Constantes derivadas se calculan al importar */
export const DERIVADA = CONSTANTE_A / CONSTANTE_B;
```

**Reglas:**
- `UPPER_SNAKE_CASE` para todas las constantes
- JSDoc en cada constante exportada
- Tipar explícitamente cuando sea un objeto/array complejo
- Agrupar constantes relacionadas juntas

---

## Convenciones de Estilo (UI)

### TailwindCSS 4

- Importar en `index.css` con `@import "tailwindcss";`
- Plugin Vite: `@tailwindcss/vite` en `vite.config.ts`
- **No** usar archivo `tailwind.config.js` (Tailwind 4 detecta automáticamente)

### Paleta de colores (Dark Theme)

| Uso | Color | Clase Tailwind |
|---|---|---|
| Fondo principal | `#111827` | `bg-gray-900` |
| Fondo secundario | `#1f2937` | `bg-gray-800` |
| Bordes | `#374151` | `border-gray-700` |
| Texto primario | `#f3f4f6` | `text-gray-100` |
| Texto secundario | `#9ca3af` | `text-gray-400` |
| Texto terciario | `#6b7280` | `text-gray-500` |
| Acento primario | `#6366f1` | `text-indigo-500`, `bg-indigo-600` |
| Acento hover | `#4f46e5` | `bg-indigo-600/20` |
| Éxito | `#10b981` | `bg-emerald-600` |
| Peligro | `#ef4444` | `bg-red-600`, `text-red-400` |

### Patrones UI recurrentes

```tsx
// Botón de acción activa/inactiva (toggle)
className={`px-2.5 py-1.5 rounded text-sm transition-colors ${
    activo
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
        : 'text-gray-400 hover:bg-gray-700 border border-transparent'
}`}

// Panel lateral
className="w-64 bg-gray-900 border-l border-gray-700 flex flex-col shrink-0 overflow-y-auto"

// Sección con label
<label className="text-xs text-gray-400 uppercase tracking-wider">Label</label>

// Input/Select
className="bg-gray-800 text-gray-200 border border-gray-600 rounded px-2 py-1 text-sm
  focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"

// Badge de estado
className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
  bg-emerald-900/30 text-emerald-400 border border-emerald-700/30"

// Valor monoespaciado
className="text-sm text-gray-200 font-mono"
```

### Tipografía
- Font principal: `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`
- Font monoespaciada: Tailwind `font-mono` para valores numéricos
- Labels: `text-xs uppercase tracking-wider text-gray-400`

### Scrollbar personalizado
Definido globalmente en `index.css` con pseudo-elementos `::-webkit-scrollbar`.

---

## Integración con Fabric.js 7

### Inicialización del canvas

```tsx
const canvas = new fabric.Canvas(element, {
    width: anchoEnPixeles,
    height: altoEnPixeles,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
});
```

### Propiedades custom en objetos

```tsx
// Extender tipos con intersección (NO modificar prototipos)
const obj = fabricImg as fabric.FabricObject & { objectId?: string; objectName?: string };
obj.objectId = generateId();
obj.objectName = name;
```

### Estilo de esquinas y bordes de selección

```tsx
fabricObj.set({
    cornerColor: '#6366f1',
    cornerStrokeColor: '#4f46e5',
    cornerStyle: 'circle',
    cornerSize: 10,
    transparentCorners: false,
    borderColor: '#6366f1',
    borderScaleFactor: 2,
});
```

### Eventos del canvas

```tsx
canvas.on('selection:created', syncSelection);
canvas.on('selection:updated', syncSelection);
canvas.on('selection:cleared', () => setSelectedObjectInfo(null));
canvas.on('object:modified', syncSelection);
canvas.on('object:moving', (e) => {
    // Acceder al store con getState() (fuera del ciclo React)
    if (!useEditorStore.getState().settings.snapToGrid) return;
    // ...snap lógica
});
```

### Exportación de alta resolución

- Usar `DPI_MULTIPLIER` (300/96 ≈ 3.125x) para calidad de impresión
- Ocultar grid antes de exportar, restaurar después
- `canvas.discardActiveObject()` antes de generar imagen
- `enableRetinaScaling: false` para control preciso del tamaño

---

## TypeScript Strict

### Configuración activa

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "erasableSyntaxOnly": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedSideEffectImports": true,
  "verbatimModuleSyntax": true
}
```

### Reglas de tipado

- **`import type`** obligatorio para importaciones que solo son tipos
- Evitar `any`: usar tipos explícitos o genéricos
- Non-null assertions (`!`) solo cuando la existencia está garantizada por lógica previa
- Union types para estados discretos: `'png' | 'pdf'`, `'select' | 'upload' | ...`
- Interfaces para objetos, `type` para uniones y alias simples

---

## ESLint

Configuración flat config con:
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `eslint-plugin-react-hooks` (reglas de hooks)
- `eslint-plugin-react-refresh` (validación HMR Vite)
- Target: `ecmaVersion: 2020`, globals: `browser`

> [!TIP]
> Para deshabilitar una regla puntualmente (ej: deps de `useEffect` que se quieren ejecutar una sola vez), usar el comentario `// eslint-disable-next-line react-hooks/exhaustive-deps` con una explicación.

---

## Flujo de Comunicación entre Componentes

```
EditorLayout (composición)
  ├── TopToolbar        ← recibe canvasActions (export, zoom, config)
  ├── LeftPanel         ← recibe canvasActions (upload, delete, lock, z-order)
  ├── AssetLibrary      ← recibe canvasActions (re-añadir assets al canvas)
  ├── CanvasEditor      ← crea y reporta canvasActions vía onActionsReady
  └── RightPanel        ← lee selectedObjectInfo del store (solo lectura)
```

- **`canvasActions`** se crean en `useFabricCanvas` dentro de `CanvasEditor`
- Se reportan al padre via `queueMicrotask(() => onActionsReady(actions))`
- Se pasan como props a los componentes que necesitan interactuar con el canvas
- El estado de selección se sincroniza vía **Zustand** (no props)

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilar TypeScript + build producción |
| `npm run lint` | Ejecutar ESLint |
| `npm run preview` | Preview del build de producción |

---

## Checklist para Nuevas Features

- [ ] ¿Los tipos están en `types/index.ts`?
- [ ] ¿Las constantes están en `constants/index.ts` con JSDoc?
- [ ] ¿El componente usa `export default function`?
- [ ] ¿Los selectores Zustand son atómicos `(s) => s.campo`?
- [ ] ¿Los handlers usan `useCallback`?
- [ ] ¿Las utilidades son funciones puras con JSDoc?
- [ ] ¿Se usa `import type` para imports de solo tipos?
- [ ] ¿El estilo sigue la paleta dark theme con Tailwind?
- [ ] ¿Compila sin errores con `npm run build`?
- [ ] ¿Pasa `npm run lint`?
