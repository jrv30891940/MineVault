/* ================================================================
   MINEVAULT — script.js
   Architecture: Vanilla ES6+ Modules Pattern | Supabase Integration
   Author: Senior Full-Stack (MineVault)
================================================================ */

'use strict';

/* ----------------------------------------------------------------
   CONFIG — Replace with your Supabase credentials
---------------------------------------------------------------- */
const CONFIG = {
  supabase: {
    url: 'https://vngmekhbsqckgnyfgwzb.supabase.co',
    key: 'sb_publishable_93Jwc68_ox-ZISMMZus4Qg_LJiT_YSk',
  },
  downloadDelay: 5,       // seconds
  searchDebounce: 300,    // ms
  itemsPerPage: 12,
  versions: ['1.21', '1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.16.5'],
};

/* ================================================================
   SUPABASE CLIENT
================================================================ */
let supabaseClient = null;

function initSupabase() {
  try {
    if (typeof window.supabase !== 'undefined') {
      supabaseClient = window.supabase.createClient(
        CONFIG.supabase.url,
        CONFIG.supabase.key
      );
    }
  } catch (e) {
    console.warn('[MineVault] Supabase not available, using mock data.');
  }
}

/* ================================================================
   MOCK DATA (fallback when Supabase is not configured)
================================================================ */
const MOCK = {
  categories: [
    { id: 1, name: 'Performance', icon: '⚡', slug: 'performance' },
    { id: 2, name: 'Gráficos',   icon: '🎨', slug: 'graphics' },
    { id: 3, name: 'Aventura',   icon: '🗺️', slug: 'adventure' },
    { id: 4, name: 'Tecnología', icon: '🔧', slug: 'tech' },
    { id: 5, name: 'Mobs',       icon: '🐉', slug: 'mobs' },
    { id: 6, name: 'Construcción',icon: '🏗️', slug: 'building' },
    { id: 7, name: 'Magia',      icon: '✨', slug: 'magic' },
    { id: 8, name: 'Utilidades', icon: '🛠️', slug: 'utility' },
  ],

  mods: [
    {
      id: 1,
      name: 'OptiFine Ultra',
      short_desc: 'El mod de optimización gráfica más popular para Minecraft.',
      description: '## OptiFine Ultra\n\nOptiFine es un **mod de optimización** que mejora drásticamente el rendimiento de Minecraft, añadiendo soporte para shaders, zoom óptico y una gran cantidad de opciones de vídeo avanzadas.\n\n### Características principales\n\n- Soporte completo para **shaders HD**\n- Zoom con tecla configurada\n- Control total de partículas\n- Mejora del FPS hasta un 300%\n\n```\nInstalación: Requiere Forge o Fabric\n```',
      image_url: 'https://picsum.photos/seed/optifine/800/400',
      downloads: 2450000,
      category: 'performance',
      version: '1.20.4',
      tags: ['performance', 'shaders', 'fps', 'optimization'],
      is_featured: true,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 2,
      name: 'Biomes O\' Plenty',
      short_desc: 'Añade más de 90 nuevos biomas al mundo de Minecraft.',
      description: '## Biomes O\' Plenty\n\nExpande masivamente la generación del mundo con **más de 90 biomas únicos**, cada uno con su flora, fauna y estructuras propias.\n\n### Nuevos biomas incluidos\n\n- Bosque de flores de cerezo\n- Desierto de cristal\n- Jungla volcánica\n- Pradera de lavanda\n\nCompatible con **Fabric y Forge**.',
      image_url: 'https://picsum.photos/seed/biomes/800/400',
      downloads: 1890000,
      category: 'adventure',
      version: '1.20.1',
      tags: ['biomes', 'world-gen', 'exploration'],
      is_featured: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 3,
      name: 'Create Mod',
      short_desc: 'Mecánicas industriales y automatización épica.',
      description: '## Create\n\nIntroduce **mecánicas de ingeniería** completamente nuevas basadas en física simulada. Construye máquinas, automatiza granjas y crea fábricas increíbles.\n\n### Componentes principales\n\n- Engranajes y transmisores\n- Cintas transportadoras\n- Prensas mecánicas\n- Hornos de fundición\n\n> "El mod más creativo del 2024"',
      image_url: 'https://picsum.photos/seed/create/800/400',
      downloads: 3120000,
      category: 'tech',
      version: '1.20.1',
      tags: ['technology', 'automation', 'engineering'],
      is_featured: false,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 4,
      name: 'Alex\'s Mobs',
      short_desc: 'Más de 80 criaturas nuevas con comportamientos únicos.',
      description: '## Alex\'s Mobs\n\nAñade más de **80 mobs completamente nuevos** al juego, con animaciones detalladas, drops especiales y comportamientos AI únicos.\n\n### Destacados\n\n- Caimán del pantano\n- Ballena azul oceánica\n- Terópodo de la jungla\n- Cobra del desierto',
      image_url: 'https://picsum.photos/seed/alexmobs/800/400',
      downloads: 987000,
      category: 'mobs',
      version: '1.20.1',
      tags: ['mobs', 'animals', 'creatures'],
      is_featured: false,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 5,
      name: 'Iris Shaders',
      short_desc: 'Soporte de shaders optimizado para Fabric.',
      description: '## Iris Shaders\n\nIris es una alternativa **open-source** a OptiFine para shaders, diseñada específicamente para el ecosistema Fabric con mejor rendimiento.\n\n### Ventajas\n\n- Compatible con Sodium\n- Mejor FPS que OptiFine\n- Shaders GLSL optimizados',
      image_url: 'https://picsum.photos/seed/iris/800/400',
      downloads: 756000,
      category: 'graphics',
      version: '1.21',
      tags: ['shaders', 'graphics', 'fabric'],
      is_featured: false,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 6,
      name: 'Applied Energistics 2',
      short_desc: 'Almacenamiento digital y redes de energía cuántica.',
      description: '## Applied Energistics 2\n\nSistema de **almacenamiento digital** masivo con redes de items, fluidos y energía. Automatiza cualquier proceso industrial.\n\n### Red ME\n\n- Almacenamiento en drives digitales\n- Autocrafting automatizado\n- Terminales de acceso\n- Exportadores e importadores',
      image_url: 'https://picsum.photos/seed/ae2/800/400',
      downloads: 1230000,
      category: 'tech',
      version: '1.20.1',
      tags: ['storage', 'automation', 'energy'],
      is_featured: false,
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 7,
      name: 'Botania',
      short_desc: 'Magia basada en flores y energía natural (Mana).',
      description: '## Botania\n\nMod de **magia natural** completamente único, basado en flores místicas y energía Mana. Sin GUIs complejas, todo interactivo.\n\n### Sistema Mana\n\n- Flores generadoras de Mana\n- Spreaders y pooling\n- Runas y armas\n- El Terrasteel como material endgame',
      image_url: 'https://picsum.photos/seed/botania/800/400',
      downloads: 890000,
      category: 'magic',
      version: '1.20.1',
      tags: ['magic', 'mana', 'flowers'],
      is_featured: false,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 8,
      name: 'Sodium',
      short_desc: 'Renderizado optimizado. El mejor reemplazo del motor gráfico.',
      description: '## Sodium\n\nMod de **renderizado de alto rendimiento** para Fabric. Reemplaza el motor de renderizado de Minecraft con uno altamente optimizado.\n\n- Hasta 500% más FPS\n- Soporte multi-hilo\n- Sin cambios en gameplay',
      image_url: 'https://picsum.photos/seed/sodium/800/400',
      downloads: 4500000,
      category: 'performance',
      version: '1.21',
      tags: ['performance', 'fps', 'rendering'],
      is_featured: false,
      created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
      download_url: '#',
    },
    {
      id: 9,
      name: 'Quark',
      short_desc: 'Cientos de pequeñas mejoras que no rompen la esencia vanilla.',
      description: '## Quark\n\nColección de **pequeñas mejoras vanilla-friendly**, cada una desactivable individualmente. Añade calidad de vida sin cambiar el espíritu de Minecraft.',
      image_url: 'https://picsum.photos/seed/quark/800/400',
      downloads: 2100000,
      category: 'utility',
      version: '1.20.1',
      tags: ['utility', 'vanilla', 'qol'],
      is_featured: false,
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      download_url: '#',
    },
    {
      id: 10,
      name: 'Tinkers\' Construct',
      short_desc: 'Sistema de crafteo de herramientas completamente personalizable.',
      description: '## Tinkers\' Construct\n\nCraft de **herramientas modulares** con materiales combinables. Cada parte afecta estadísticas y habilidades.\n\n- Fundición y colado de metales\n- Herramientas moddables\n- Toneladas de materiales',
      image_url: 'https://picsum.photos/seed/tinkers/800/400',
      downloads: 1678000,
      category: 'tech',
      version: '1.18.2',
      tags: ['tools', 'crafting', 'materials'],
      is_featured: false,
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 11,
      name: 'Terraforged',
      short_desc: 'Generación de mundo ultra-realista con montañas épicas.',
      description: '## Terraforged\n\nGenerador de mundo que crea **paisajes geológicamente realistas** con montañas, valles, ríos y llanuras dramáticas.',
      image_url: 'https://picsum.photos/seed/terraforged/800/400',
      downloads: 543000,
      category: 'adventure',
      version: '1.18.2',
      tags: ['world-gen', 'terrain', 'realism'],
      is_featured: false,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      download_url: '#',
    },
    {
      id: 12,
      name: 'Chisel & Bits',
      short_desc: 'Esculpe bloques a nivel de píxel para construcciones increíbles.',
      description: '## Chisel & Bits\n\nPermite **esculpir bloques individuales** por voxel, creando detalles arquitectónicos imposibles con bloques normales.\n\n- Herramienta Chisel\n- Modo diseño\n- Compartir patrones',
      image_url: 'https://picsum.photos/seed/chisel/800/400',
      downloads: 765000,
      category: 'building',
      version: '1.20.1',
      tags: ['building', 'decoration', 'detail'],
      is_featured: false,
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      download_url: '#',
    },
  ],

  skins: [
    { id: 1, name: 'Cyber Steve',   image_url: 'https://picsum.photos/seed/skin1/100/100', downloads: 45000 },
    { id: 2, name: 'Dragon Slayer', image_url: 'https://picsum.photos/seed/skin2/100/100', downloads: 38000 },
    { id: 3, name: 'Neon Alex',     image_url: 'https://picsum.photos/seed/skin3/100/100', downloads: 29000 },
    { id: 4, name: 'Void Knight',   image_url: 'https://picsum.photos/seed/skin4/100/100', downloads: 22000 },
    { id: 5, name: 'Pixel Witch',   image_url: 'https://picsum.photos/seed/skin5/100/100', downloads: 18000 },
    { id: 6, name: 'Gold Miner',    image_url: 'https://picsum.photos/seed/skin6/100/100', downloads: 15000 },
    { id: 7, name: 'Shadow Ninja',  image_url: 'https://picsum.photos/seed/skin7/100/100', downloads: 12000 },
    { id: 8, name: 'Emerald Guard', image_url: 'https://picsum.photos/seed/skin8/100/100', downloads: 9000  },
  ],

  wiki: [
    {
      id: 1,
      title: 'Cómo instalar mods con Forge',
      category: 'Instalación',
      order: 1,
      content: '# Cómo instalar mods con Forge\n\n## ¿Qué es Forge?\n\n**Minecraft Forge** es el loader de mods más popular y compatible. Permite cargar mods `.jar` de manera sencilla.\n\n## Pasos de instalación\n\n### 1. Descargar Forge\n\nVe a [minecraftforge.net](https://minecraftforge.net) y descarga la versión **Recommended** para tu versión de Minecraft.\n\n### 2. Ejecutar el instalador\n\n```bash\njava -jar forge-installer.jar\n```\n\nSelecciona "Install Client" y haz clic en OK.\n\n### 3. Copiar mods\n\nColoca los archivos `.jar` de tus mods en:\n\n```\n%AppData%\\.minecraft\\mods\\\n```\n\n### 4. Lanzar el juego\n\nAbre el Launcher y selecciona el perfil **Forge**. ¡Listo!\n\n> **Nota:** Verifica que la versión del mod coincida con tu versión de Minecraft.',
    },
    {
      id: 2,
      title: 'Instalación con Fabric',
      category: 'Instalación',
      order: 2,
      content: '# Instalación con Fabric\n\n**Fabric** es un loader ligero y moderno, ideal para mods de rendimiento.\n\n## Instalación\n\n1. Descarga el instalador desde [fabricmc.net](https://fabricmc.net)\n2. Ejecuta el instalador\n3. Instala también **Fabric API** (requerido por la mayoría de mods)\n4. Coloca tus mods `.jar` en la carpeta `mods`\n\n## Diferencia con Forge\n\n| | Forge | Fabric |\n|---|---|---|\n| Compatibilidad | Alta | Media |\n| Rendimiento | Normal | Mejor |\n| Mods disponibles | Más | Menos |',
    },
    {
      id: 3,
      title: 'Optimizar el rendimiento de Minecraft',
      category: 'Guías Avanzadas',
      order: 1,
      content: '# Optimizar el rendimiento de Minecraft\n\n## Mods de rendimiento recomendados\n\n### Para Fabric\n\n- **Sodium** – Motor de render optimizado\n- **Lithium** – Optimiza el servidor local\n- **Phosphor** – Mejora el motor de iluminación\n- **Iris** – Shaders sin pérdida de FPS\n\n### Para Forge\n\n- **OptiFine** – Todo en uno\n- **FoamFix** – Reduce uso de RAM\n\n## Configuración de Java\n\nAñade estos argumentos JVM:\n\n```\n-Xmx4G -Xms2G -XX:+UseG1GC\n```\n\nEsto mejora el garbage collection y previene lag spikes.',
    },
    {
      id: 4,
      title: 'Los mejores shaders del 2025',
      category: 'Guías Avanzadas',
      order: 2,
      content: '# Mejores Shaders 2025\n\n## Top Shaders\n\n### 🥇 Complementary Shaders\n\nEl más equilibrado. Excelente calidad visual sin sacrificar FPS en exceso.\n\n### 🥈 BSL Shaders\n\nSombras suaves y colores vibrantes. Perfecto para screenshots.\n\n### 🥉 Sildur\'s Vibrant Shaders\n\nVarias versiones desde lite hasta ultra. Ideal para GPUs mid-range.\n\n## Requisitos mínimos\n\n| Shader | GPU mínima | VRAM |\n|--------|-----------|------|\n| Sildur Lite | GTX 750 | 2GB |\n| BSL | GTX 1060 | 4GB |\n| Complementary | GTX 1070 | 6GB |',
    },
    {
      id: 5,
      title: '¿Qué es un Modpack?',
      category: 'Conceptos Básicos',
      order: 1,
      content: '# ¿Qué es un Modpack?\n\nUn **modpack** es una colección preconfigurada de mods diseñados para funcionar juntos sin conflictos.\n\n## Ventajas\n\n- Sin problemas de compatibilidad\n- Experiencia curada\n- Fácil instalación via launchers\n\n## Launchers recomendados\n\n- **CurseForge** – El más popular\n- **Modrinth** – Open source y rápido\n- **FTB** – Especializado en modpacks técnicos\n\n## Modpacks populares\n\n1. **All the Mods 9** – Técnico completo\n2. **Roguelike Adventures** – Aventura y exploración\n3. **SkyFactory 4** – Skyblock con mods',
    },
  ],
};

/* ================================================================
   STATE MANAGER
================================================================ */
const STATE = {
  page: 'home',
  mods: [],
  skins: [],
  wiki: [],
  categories: [],
  filteredMods: [],
  activeCatSlug: 'all',
  searchQuery: '',
  modsSortBy: 'downloads',
  modsPage: 0,
  selectedMod: null,
  editingItem: { type: null, id: null },
  isAdmin: false,
  adminUser: null,
  activeWikiCat: null,
};

/* ================================================================
   DATABASE LAYER (Supabase + fallback)
================================================================ */
const DB = {
  async getMods() {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      return MOCK.mods.sort((a, b) => b.downloads - a.downloads);
    }
    const { data, error } = await supabaseClient
      .from('mods')
      .select('*')
      .order('downloads', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getSkins() {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      return MOCK.skins;
    }
    const { data, error } = await supabaseClient
      .from('skins')
      .select('*')
      .order('downloads', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getWiki() {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      return MOCK.wiki;
    }
    const { data, error } = await supabaseClient
      .from('wiki')
      .select('*')
      .order('category')
      .order('order');
    if (error) throw error;
    return data;
  },

  async getCategories() {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      return MOCK.categories;
    }
    const { data, error } = await supabaseClient.from('categories').select('*');
    if (error) throw error;
    return data;
  },

  async incrementDownloads(modId) {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      const mod = STATE.mods.find(m => m.id === modId);
      if (mod) mod.downloads++;
      return;
    }
    await supabaseClient.rpc('increment_downloads', { mod_id: modId });
  },

  async saveMod(data, id = null) {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      if (id) {
        const idx = STATE.mods.findIndex(m => m.id === id);
        if (idx !== -1) STATE.mods[idx] = { ...STATE.mods[idx], ...data };
      } else {
        const newMod = { ...data, id: Date.now(), downloads: 0, created_at: new Date().toISOString() };
        STATE.mods.unshift(newMod);
      }
      return;
    }
    if (id) {
      const { error } = await supabaseClient.from('mods').update(data).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabaseClient.from('mods').insert(data);
      if (error) throw error;
    }
  },

  async deleteMod(id) {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      STATE.mods = STATE.mods.filter(m => m.id !== id);
      return;
    }
    const { error } = await supabaseClient.from('mods').delete().eq('id', id);
    if (error) throw error;
  },

  async saveWiki(data, id = null) {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      if (id) {
        const idx = STATE.wiki.findIndex(w => w.id === id);
        if (idx !== -1) STATE.wiki[idx] = { ...STATE.wiki[idx], ...data };
      } else {
        STATE.wiki.push({ ...data, id: Date.now(), created_at: new Date().toISOString() });
      }
      return;
    }
    if (id) {
      const { error } = await supabaseClient.from('wiki').update(data).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabaseClient.from('wiki').insert(data);
      if (error) throw error;
    }
  },

  async deleteWiki(id) {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      STATE.wiki = STATE.wiki.filter(w => w.id !== id);
      return;
    }
    const { error } = await supabaseClient.from('wiki').delete().eq('id', id);
    if (error) throw error;
  },

  async login(email, password) {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      if (email === 'j30891940@gmail.com' && password === 'Jarm2004.,') {
        return { user: { email } };
      }
      throw new Error('Credenciales incorrectas');
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) return;
    await supabaseClient.auth.signOut();
  },

  async uploadImage(file, bucket = 'mods') {
    if (!supabaseClient || CONFIG.supabase.url.includes('YOUR_PROJECT')) {
      return URL.createObjectURL(file);
    }
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await supabaseClient.storage.from(bucket).upload(path, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabaseClient.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  },
};

/* ================================================================
   ROUTER (SPA)
================================================================ */
const Router = {
  init() {
    // Handle nav links
    document.querySelectorAll('[data-section]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const section = el.dataset.section;
        Router.navigate(section);
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', e => {
      if (e.state?.page) Router.navigate(e.state.page, false);
    });

    // Initial route from hash
    const hash = location.hash.replace('#', '') || 'home';
    Router.navigate(hash, false);
  },

  navigate(page, pushState = true) {
    STATE.page = page;

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });

    // Show target
    const target = document.getElementById(`page-${page}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav active state
    document.querySelectorAll('.nav-link, .drawer-link').forEach(el => {
      el.classList.toggle('active', el.dataset.section === page);
    });

    if (pushState) {
      history.pushState({ page }, '', `#${page}`);
    }

    // Close drawer on mobile
    UI.closeDrawer();

    // Page-specific init
    switch (page) {
      case 'mods':   Mods.renderFull(); break;
      case 'skins':  Skins.renderFull(); break;
      case 'wiki':   Wiki.render(); break;
      case 'admin':  Admin.init(); break;
    }
  },
};

/* ================================================================
   UI UTILITIES
================================================================ */
const UI = {
  /* ----- Loader ----- */
  hideLoader() {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 1800);
  },

  /* ----- Overlay ----- */
  showOverlay(onClick) {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    overlay._handler = onClick;
    overlay.addEventListener('click', onClick, { once: true });
  },

  hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  },

  /* ----- Drawer ----- */
  openDrawer() {
    const drawer = document.getElementById('navDrawer');
    const hamburger = document.getElementById('hamburger');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    UI.showOverlay(UI.closeDrawer.bind(UI));
  },

  closeDrawer() {
    const drawer = document.getElementById('navDrawer');
    const hamburger = document.getElementById('hamburger');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    UI.hideOverlay();
  },

  /* ----- Search ----- */
  toggleSearch() {
    const navSearch = document.getElementById('navSearch');
    const btn = document.getElementById('searchToggle');
    const isOpen = navSearch.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      setTimeout(() => document.getElementById('globalSearch').focus(), 100);
    }
  },

  closeSearch() {
    document.getElementById('navSearch').classList.remove('open');
    document.getElementById('searchToggle').setAttribute('aria-expanded', 'false');
    document.getElementById('globalSearch').value = '';
    document.getElementById('searchResults').classList.remove('has-results');
    document.getElementById('searchResults').innerHTML = '';
  },

  /* ----- Toast ----- */
  toast(msg, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.classList.add('hiding');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, duration);
  },

  /* ----- Format number ----- */
  formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  },

  /* ----- Format date ----- */
  formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  /* ----- Skeleton placeholder ----- */
  skeleton(rows = 6) {
    return Array.from({ length: rows }, () => `
      <div class="mod-card">
        <div class="mod-card__img-wrap skeleton" style="aspect-ratio:16/9"></div>
        <div class="mod-card__body">
          <div class="skeleton" style="height:12px;width:60%;margin-bottom:8px;border-radius:4px"></div>
          <div class="skeleton" style="height:20px;width:90%;margin-bottom:8px;border-radius:4px"></div>
          <div class="skeleton" style="height:14px;width:80%;border-radius:4px"></div>
        </div>
      </div>
    `).join('');
  },
};

/* ================================================================
   MARKDOWN RENDERER (minimal, no deps)
================================================================ */
const MD = {
  render(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`)
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold / Italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Blockquote
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // Unordered list
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr/>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p>')
      // Wrap list items
      .replace(/(<li>[\s\S]+?<\/li>)+/g, '<ul>$&</ul>');

    return `<p>${html}</p>`;
  },
};

/* ================================================================
   SCROLL REVEAL
================================================================ */
const ScrollReveal = {
  observer: null,
  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('mod-card') ||
              entry.target.classList.contains('skin-card') ||
              entry.target.classList.contains('wiki-article-card')) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  },

  observe(el) {
    if (this.observer) this.observer.observe(el);
  },

  observeAll(selector) {
    document.querySelectorAll(selector).forEach(el => this.observe(el));
  },
};

/* ================================================================
   PARTICLES
================================================================ */
const Particles = {
  colors: ['#00d46a', '#00ff7f', '#f5c842', '#ffffff', '#8a9ab0'],
  create() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    container.innerHTML = '';
    const count = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'pixel-particle';
      const size = Math.random() * 8 + 4;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        background:${this.colors[Math.floor(Math.random() * this.colors.length)]};
        --dur:${Math.random() * 8 + 4}s;
        --delay:${Math.random() * 4}s;
        opacity:0.3;
        border-radius:1px;
      `;
      container.appendChild(p);
    }
  },
};

/* ================================================================
   NAVBAR
================================================================ */
const Navbar = {
  init() {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      const navbar = document.getElementById('navbar');
      navbar.classList.toggle('scrolled', curr > 60);
      lastScroll = curr;
    }, { passive: true });

    document.getElementById('hamburger').addEventListener('click', UI.openDrawer.bind(UI));
    document.getElementById('closeDrawer').addEventListener('click', UI.closeDrawer.bind(UI));
    document.getElementById('searchToggle').addEventListener('click', UI.toggleSearch.bind(UI));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        UI.closeSearch();
        UI.closeDrawer();
        Modal.close('modModal');
        Modal.close('modFormModal');
        Modal.close('wikiFormModal');
      }
    });
  },
};

/* ================================================================
   SEARCH
================================================================ */
const Search = {
  debounceTimer: null,

  init() {
    const globalInput = document.getElementById('globalSearch');
    globalInput.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performGlobal(globalInput.value.trim());
      }, CONFIG.searchDebounce);
    });

    const modsInput = document.getElementById('modsSearch');
    modsInput.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        STATE.searchQuery = modsInput.value.trim().toLowerCase();
        Mods.applyFilters();
      }, CONFIG.searchDebounce);
    });

    const skinsInput = document.getElementById('skinsSearch');
    skinsInput.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        Skins.renderFull(skinsInput.value.trim().toLowerCase());
      }, CONFIG.searchDebounce);
    });
  },

  performGlobal(query) {
    const container = document.getElementById('searchResults');
    if (!query) {
      container.classList.remove('has-results');
      container.innerHTML = '';
      return;
    }

    const q = query.toLowerCase();
    const results = [
      ...STATE.mods.filter(m => m.name.toLowerCase().includes(q) || m.short_desc.toLowerCase().includes(q))
        .slice(0, 4)
        .map(m => ({ ...m, _type: 'Mod' })),
      ...STATE.skins.filter(s => s.name.toLowerCase().includes(q))
        .slice(0, 2)
        .map(s => ({ ...s, _type: 'Skin' })),
      ...STATE.wiki.filter(w => w.title.toLowerCase().includes(q))
        .slice(0, 2)
        .map(w => ({ ...w, _type: 'Wiki', image_url: null })),
    ];

    if (!results.length) {
      container.innerHTML = '<p style="padding:1rem;color:var(--col-text-muted);font-size:.8rem;">Sin resultados</p>';
      container.classList.add('has-results');
      return;
    }

    container.innerHTML = results.map(item => `
      <div class="search-result-item" data-id="${item.id}" data-type="${item._type}" role="option">
        ${item.image_url
          ? `<img class="search-result-item__img" src="${item.image_url}" alt="${item.name || item.title}" loading="lazy" />`
          : `<div class="search-result-item__img skeleton"></div>`
        }
        <div class="search-result-item__info">
          <div class="search-result-item__name">${item.name || item.title}</div>
          <div class="search-result-item__type">${item._type}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const type = el.dataset.type;
        const id = parseInt(el.dataset.id);
        UI.closeSearch();
        if (type === 'Mod') {
          const mod = STATE.mods.find(m => m.id === id);
          if (mod) Modal.openMod(mod);
        } else if (type === 'Wiki') {
          Router.navigate('wiki');
          setTimeout(() => Wiki.openArticle(id), 200);
        }
      });
    });

    container.classList.add('has-results');
  },
};

/* ================================================================
   MODAL
================================================================ */
const Modal = {
  open(id) {
    const modal = document.getElementById(id);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    UI.showOverlay(() => Modal.close(id));
  },

  close(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    UI.hideOverlay();
  },

  openMod(mod) {
    STATE.selectedMod = mod;

    const tags = (mod.tags || []).map(t => `<span class="tag tag--emerald">${t}</span>`).join('');
    const catBadge = mod.category
      ? `<span class="badge badge--stone">${mod.category}</span>`
      : '';

    document.getElementById('modalModImage').src = mod.image_url || '';
    document.getElementById('modalModImage').alt = mod.name;
    document.getElementById('modalModTitle').textContent = mod.name;
    document.getElementById('modalModCategories').innerHTML = catBadge;
    document.getElementById('modalModMeta').innerHTML = `
      <span>📥 ${UI.formatNum(mod.downloads)} descargas</span>
      <span>🎮 MC ${mod.version || 'N/A'}</span>
      <span>📅 ${UI.formatDate(mod.created_at)}</span>
    `;
    document.getElementById('modalModDescription').innerHTML = MD.render(mod.description || mod.short_desc || '');
    document.getElementById('modalInfoGrid').innerHTML = `
      <div class="info-item"><div class="info-item__label">Categoría</div><div class="info-item__value">${mod.category || '—'}</div></div>
      <div class="info-item"><div class="info-item__label">Versión</div><div class="info-item__value">${mod.version || '—'}</div></div>
      <div class="info-item"><div class="info-item__label">Descargas</div><div class="info-item__value">${UI.formatNum(mod.downloads)}</div></div>
      <div class="info-item"><div class="info-item__label">Publicado</div><div class="info-item__value">${UI.formatDate(mod.created_at)}</div></div>
    `;

    // Tags
    document.getElementById('modalModCategories').innerHTML = tags || catBadge;

    // Reset download button
    const dlBtn = document.getElementById('downloadBtn');
    const dlCounter = document.getElementById('downloadCounter');
    dlBtn.style.display = 'flex';
    dlCounter.style.display = 'none';
    dlBtn.disabled = false;
    dlBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Descargar Mod`;

    Modal.open('modModal');
  },
};

/* ================================================================
   HERO
================================================================ */
const Hero = {
  render() {
    const featured = STATE.mods.find(m => m.is_featured) || STATE.mods[0];
    if (!featured) return;

    document.getElementById('heroTitle').textContent = featured.name;
    document.getElementById('heroSubtitle').textContent = featured.short_desc || '';
    document.getElementById('heroMeta').innerHTML = `
      <span class="badge badge--emerald">📥 ${UI.formatNum(featured.downloads)} descargas</span>
      <span class="badge badge--stone">🎮 MC ${featured.version || ''}</span>
      <span class="badge badge--stone">${featured.category || ''}</span>
    `;

    const heroImg = document.getElementById('heroImage');
    if (featured.image_url) {
      heroImg.src = featured.image_url;
      heroImg.alt = featured.name;
      document.getElementById('heroImageWrap').style.opacity = '1';
    }

    // Set hero background with image
    const heroBg = document.getElementById('heroBg');
    if (featured.image_url) {
      heroBg.style.backgroundImage = `url(${featured.image_url})`;
      heroBg.style.backgroundSize = 'cover';
      heroBg.style.backgroundPosition = 'center';
      heroBg.style.filter = 'blur(2px)';
    }

    document.getElementById('heroDownloadBtn').addEventListener('click', () => {
      Downloads.start(featured);
    });

    document.getElementById('heroDetailBtn').addEventListener('click', () => {
      Modal.openMod(featured);
    });
  },
};

/* ================================================================
   STATS BAR
================================================================ */
const StatsBar = {
  render() {
    const totalDownloads = STATE.mods.reduce((a, b) => a + (b.downloads || 0), 0);
    this.animateCount('statMods', STATE.mods.length);
    this.animateCount('statSkins', STATE.skins.length);
    this.animateCount('statDownloads', totalDownloads, true);
    this.animateCount('statWiki', STATE.wiki.length);
  },

  animateCount(id, target, format = false) {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const duration = 1200;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = format ? UI.formatNum(Math.round(start)) : Math.round(start).toLocaleString();
      if (start >= target) clearInterval(timer);
    }, 16);
  },
};

/* ================================================================
   CATEGORIES
================================================================ */
const Categories = {
  render() {
    const strip = document.getElementById('categoriesStrip');
    const cats = [
      { slug: 'all', name: 'Todos', icon: '🌐' },
      ...STATE.categories,
    ];
    strip.innerHTML = cats.map(c => `
      <button class="cat-chip ${c.slug === 'all' ? 'active' : ''}" data-slug="${c.slug}" role="listitem">
        <span>${c.icon || ''}</span>
        <span>${c.name}</span>
      </button>
    `).join('');

    strip.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        strip.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        STATE.activeCatSlug = chip.dataset.slug;
        Mods.renderRecent();
      });
    });
  },

  renderSidebar() {
    const list = document.getElementById('modCategoryList');
    const cats = [{ id: 0, name: 'Todos', slug: 'all', icon: '🌐' }, ...STATE.categories];
    list.innerHTML = cats.map(c => {
      const count = c.slug === 'all'
        ? STATE.mods.length
        : STATE.mods.filter(m => m.category === c.slug).length;
      return `
        <li class="sidebar-cat ${c.slug === STATE.activeCatSlug ? 'active' : ''}" data-slug="${c.slug}">
          <span>${c.icon || ''} ${c.name}</span>
          <span class="sidebar-cat__count">${count}</span>
        </li>
      `;
    }).join('');

    list.querySelectorAll('.sidebar-cat').forEach(item => {
      item.addEventListener('click', () => {
        list.querySelectorAll('.sidebar-cat').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        STATE.activeCatSlug = item.dataset.slug;
        STATE.modsPage = 0;
        Mods.applyFilters();
      });
    });

    // Version filter
    const vf = document.getElementById('versionFilter');
    vf.innerHTML = CONFIG.versions.map(v => `
      <button class="version-chip" data-ver="${v}">${v}</button>
    `).join('');

    vf.querySelectorAll('.version-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        Mods.applyFilters();
      });
    });
  },
};

/* ================================================================
   MODS
================================================================ */
const Mods = {
  renderRecent() {
    const grid = document.getElementById('recentGrid');
    const cat = STATE.activeCatSlug;
    let data = cat === 'all'
      ? [...STATE.mods]
      : STATE.mods.filter(m => m.category === cat);
    data = data.slice(0, 6);

    grid.innerHTML = data.map((mod, i) => this.cardHTML(mod, i * 60)).join('');
    grid.querySelectorAll('.mod-card').forEach((card, i) => {
      card.addEventListener('click', () => Modal.openMod(data[i]));
      ScrollReveal.observe(card);
    });
  },

  renderTop10() {
    const list = document.getElementById('top10List');
    const top = [...STATE.mods]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10);

    list.innerHTML = top.map((mod, i) => {
      const rankClass = i === 0 ? 'rank--1' : i === 1 ? 'rank--2' : i === 2 ? 'rank--3' : 'rank--default';
      const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
      return `
        <div class="top10-item" data-id="${mod.id}" style="--delay:${i * 0.05}s" role="listitem">
          <div class="top10-item__rank ${rankClass}">${rankIcon}</div>
          <img class="top10-item__img" src="${mod.image_url || ''}" alt="${mod.name}" loading="lazy" />
          <div class="top10-item__info">
            <div class="top10-item__name">${mod.name}</div>
            <div class="top10-item__cat">${mod.category || ''}</div>
          </div>
          <div class="top10-item__downloads">
            ${UI.formatNum(mod.downloads)}
            <div class="top10-item__dl-label">descargas</div>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.top10-item').forEach(item => {
      item.addEventListener('click', () => {
        const mod = STATE.mods.find(m => m.id === parseInt(item.dataset.id));
        if (mod) Modal.openMod(mod);
      });
    });
  },

  renderFull() {
    Categories.renderSidebar();
    STATE.modsPage = 0;
    this.applyFilters();

    document.getElementById('sortMods').addEventListener('change', (e) => {
      STATE.modsSortBy = e.target.value;
      STATE.modsPage = 0;
      this.applyFilters();
    });

    document.getElementById('loadMoreMods').addEventListener('click', () => {
      STATE.modsPage++;
      this.appendPage();
    });
  },

  applyFilters() {
    let data = [...STATE.mods];

    // Category filter
    if (STATE.activeCatSlug !== 'all') {
      data = data.filter(m => m.category === STATE.activeCatSlug);
    }

    // Search filter
    if (STATE.searchQuery) {
      const q = STATE.searchQuery;
      data = data.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.short_desc.toLowerCase().includes(q) ||
        (m.tags || []).some(t => t.includes(q))
      );
    }

    // Version filter
    const activeVersions = [...document.querySelectorAll('.version-chip.active')].map(c => c.dataset.ver);
    if (activeVersions.length) {
      data = data.filter(m => activeVersions.includes(m.version));
    }

    // Sort
    switch (STATE.modsSortBy) {
      case 'date':    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
      case 'name':    data.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:        data.sort((a, b) => b.downloads - a.downloads);
    }

    STATE.filteredMods = data;
    STATE.modsPage = 0;
    this.renderPage();
  },

  renderPage() {
    const grid = document.getElementById('modsGrid');
    const count = document.getElementById('modsCount');
    const loadMore = document.getElementById('loadMoreMods');

    const page = STATE.filteredMods.slice(0, CONFIG.itemsPerPage);
    grid.innerHTML = page.length
      ? page.map((mod, i) => this.cardHTML(mod, i * 40)).join('')
      : '<p style="padding:2rem;color:var(--col-text-muted)">No se encontraron mods.</p>';

    count.textContent = `${STATE.filteredMods.length} resultado${STATE.filteredMods.length !== 1 ? 's' : ''}`;
    loadMore.style.display = STATE.filteredMods.length > CONFIG.itemsPerPage ? 'flex' : 'none';

    grid.querySelectorAll('.mod-card').forEach((card, i) => {
      card.addEventListener('click', () => Modal.openMod(page[i]));
      ScrollReveal.observe(card);
    });
  },

  appendPage() {
    const grid = document.getElementById('modsGrid');
    const loadMore = document.getElementById('loadMoreMods');
    const start = (STATE.modsPage) * CONFIG.itemsPerPage;
    const end = start + CONFIG.itemsPerPage;
    const page = STATE.filteredMods.slice(start, end);

    page.forEach((mod, i) => {
      const div = document.createElement('div');
      div.innerHTML = this.cardHTML(mod, i * 40);
      const card = div.firstElementChild;
      card.addEventListener('click', () => Modal.openMod(mod));
      grid.appendChild(card);
      ScrollReveal.observe(card);
    });

    if (end >= STATE.filteredMods.length) loadMore.style.display = 'none';
  },

  cardHTML(mod, delay = 0) {
    const featuredBadge = mod.is_featured
      ? `<div class="mod-card__featured-badge"><span class="badge badge--gold">⭐</span></div>` : '';
    const tags = (mod.tags || []).slice(0, 2).map(t =>
      `<span class="tag tag--emerald">${t}</span>`
    ).join('');

    return `
      <article class="mod-card" role="listitem" style="transition-delay:${delay}ms">
        <div class="mod-card__img-wrap">
          <img class="mod-card__img" src="${mod.image_url || ''}" alt="${mod.name}" loading="lazy" />
          <div class="mod-card__overlay"></div>
          ${featuredBadge}
        </div>
        <div class="mod-card__body">
          <div class="mod-card__cats">${tags}</div>
          <h3 class="mod-card__title">${mod.name}</h3>
          <p class="mod-card__desc">${mod.short_desc || ''}</p>
          <div class="mod-card__footer">
            <span class="mod-card__downloads">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ${UI.formatNum(mod.downloads || 0)}
            </span>
            <span>🎮 ${mod.version || ''}</span>
          </div>
        </div>
      </article>
    `;
  },
};

/* ================================================================
   SKINS
================================================================ */
const Skins = {
  renderPreview() {
    const grid = document.getElementById('skinsPreviewGrid');
    const data = STATE.skins.slice(0, 8);
    grid.innerHTML = data.map((skin, i) => this.cardHTML(skin, i * 50)).join('');
    grid.querySelectorAll('.skin-card').forEach((card, i) => {
      card.addEventListener('click', () => Downloads.startSkin(data[i]));
      ScrollReveal.observe(card);
    });
  },

  renderFull(query = '') {
    const grid = document.getElementById('skinsGrid');
    let data = query
      ? STATE.skins.filter(s => s.name.toLowerCase().includes(query))
      : STATE.skins;

    grid.innerHTML = data.map((skin, i) => this.cardHTML(skin, i * 40)).join('');
    grid.querySelectorAll('.skin-card').forEach((card, i) => {
      card.addEventListener('click', () => Downloads.startSkin(data[i]));
      ScrollReveal.observe(card);
    });
  },

  cardHTML(skin, delay = 0) {
    return `
      <article class="skin-card" role="listitem" style="transition-delay:${delay}ms">
        <div class="skin-card__img-wrap">
          <img class="skin-card__img" src="${skin.image_url}" alt="${skin.name}" loading="lazy" />
        </div>
        <div class="skin-card__body">
          <div class="skin-card__name">${skin.name}</div>
          <div class="skin-card__dl">📥 ${UI.formatNum(skin.downloads || 0)}</div>
        </div>
      </article>
    `;
  },
};

/* ================================================================
   WIKI
================================================================ */
const Wiki = {
  render() {
    this.renderSidebar();
    this.renderList();
    this.initAccordion();
  },

  getCategories() {
    const cats = {};
    STATE.wiki.forEach(article => {
      if (!cats[article.category]) cats[article.category] = [];
      cats[article.category].push(article);
    });
    return cats;
  },

  renderSidebar() {
    const toc = document.getElementById('wikiToc');
    const accordionBody = document.getElementById('wikiAccordionBody');
    const cats = this.getCategories();

    const tocHTML = Object.entries(cats).map(([cat, articles]) => `
      <li class="wiki-toc-item wiki-toc-item--cat">${cat}</li>
      ${articles.map(a => `
        <li class="wiki-toc-item ${STATE.activeWikiCat === a.id ? 'active' : ''}" data-id="${a.id}">
          📄 ${a.title}
        </li>
      `).join('')}
    `).join('');

    toc.innerHTML = tocHTML;
    accordionBody.innerHTML = `<ul class="wiki-toc" style="padding:.5rem">${tocHTML}</ul>`;

    [toc, accordionBody].forEach(container => {
      container.querySelectorAll('.wiki-toc-item:not(.wiki-toc-item--cat)').forEach(item => {
        item.addEventListener('click', () => this.openArticle(parseInt(item.dataset.id)));
      });
    });
  },

  renderList(catFilter = null) {
    const list = document.getElementById('wikiArticleList');
    const view = document.getElementById('wikiArticleView');
    list.style.display = 'flex';
    view.style.display = 'none';

    const data = catFilter
      ? STATE.wiki.filter(w => w.category === catFilter)
      : STATE.wiki;

    list.innerHTML = data.map((article, i) => `
      <div class="wiki-article-card" data-id="${article.id}" style="transition-delay:${i * 50}ms" role="listitem">
        <div class="wiki-article-card__cat">${article.category}</div>
        <div class="wiki-article-card__title">${article.title}</div>
      </div>
    `).join('');

    list.querySelectorAll('.wiki-article-card').forEach(card => {
      card.addEventListener('click', () => this.openArticle(parseInt(card.dataset.id)));
      ScrollReveal.observe(card);
    });
  },

  openArticle(id) {
    const article = STATE.wiki.find(w => w.id === id);
    if (!article) return;

    STATE.activeWikiCat = id;
    const list = document.getElementById('wikiArticleList');
    const view = document.getElementById('wikiArticleView');
    const articleEl = document.getElementById('wikiArticle');

    list.style.display = 'none';
    view.style.display = 'block';
    articleEl.innerHTML = MD.render(article.content);

    // Syntax highlight code blocks (simple)
    articleEl.querySelectorAll('code').forEach(code => {
      code.style.display = 'inline';
    });

    this.renderSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  initAccordion() {
    const header = document.getElementById('wikiAccordionHeader');
    const body = document.getElementById('wikiAccordionBody');

    header.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      header.classList.toggle('open', open);
      header.setAttribute('aria-expanded', open);
      body.setAttribute('aria-hidden', !open);
    });

    document.getElementById('wikiBack').addEventListener('click', () => {
      this.renderList();
      STATE.activeWikiCat = null;
    });
  },
};

/* ================================================================
   DOWNLOADS
================================================================ */
const Downloads = {
  start(mod) {
    const dlBtn = document.getElementById('downloadBtn');
    const dlCounter = document.getElementById('downloadCounter');
    const countdownEl = document.getElementById('countdownNum');

    dlBtn.style.display = 'none';
    dlCounter.style.display = 'block';

    let remaining = CONFIG.downloadDelay;
    countdownEl.textContent = remaining;

    const timer = setInterval(() => {
      remaining--;
      countdownEl.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(timer);
        dlCounter.style.display = 'none';
        dlBtn.style.display = 'flex';

        // Trigger download
        if (mod.download_url && mod.download_url !== '#') {
          const a = document.createElement('a');
          a.href = mod.download_url;
          a.download = '';
          a.target = '_blank';
          a.rel = 'noopener';
          a.click();
        }

        // Increment downloads
        DB.incrementDownloads(mod.id);
        mod.downloads = (mod.downloads || 0) + 1;
        UI.toast(`✅ Descargando ${mod.name}`, 'success');
      }
    }, 1000);
  },

  startSkin(skin) {
    UI.toast(`📥 Descargando skin "${skin.name}"…`, 'info');
    skin.downloads = (skin.downloads || 0) + 1;
    if (skin.download_url) {
      const a = document.createElement('a');
      a.href = skin.download_url;
      a.download = '';
      a.target = '_blank';
      a.click();
    }
  },
};

/* ================================================================
   ADMIN
================================================================ */
const Admin = {
  async init() {
    const loginEl = document.getElementById('adminLogin');
    const dashEl  = document.getElementById('adminDashboard');

    if (STATE.isAdmin) {
      loginEl.style.display = 'none';
      dashEl.style.display = 'block';
      this.renderDashboard();
    } else {
      loginEl.style.display = 'flex';
      dashEl.style.display = 'none';
    }

    document.getElementById('adminLoginBtn').addEventListener('click', () => this.login());
    document.getElementById('adminLogout').addEventListener('click', () => this.logout());
    document.getElementById('adminPassword').addEventListener('keydown', e => {
      if (e.key === 'Enter') this.login();
    });
    document.getElementById('togglePassword').addEventListener('click', () => {
      const pw = document.getElementById('adminPassword');
      pw.type = pw.type === 'password' ? 'text' : 'password';
    });

    // Admin tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById(`admin-tab-${tab.dataset.tab}`).classList.add('active');
      });
    });

    // New mod button
    document.getElementById('newModBtn').addEventListener('click', () => {
      STATE.editingItem = { type: 'mod', id: null };
      Forms.openMod(null);
    });

    document.getElementById('newSkinBtn').addEventListener('click', () => {
      UI.toast('Función de skins en desarrollo', 'info');
    });

    document.getElementById('newWikiBtn').addEventListener('click', () => {
      STATE.editingItem = { type: 'wiki', id: null };
      Forms.openWiki(null);
    });
  },

  async login() {
    const email    = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errEl    = document.getElementById('loginError');
    const btn      = document.getElementById('adminLoginBtn');

    errEl.textContent = '';
    btn.textContent = 'Iniciando sesión…';
    btn.disabled = true;

    try {
      const result = await DB.login(email, password);
      STATE.isAdmin = true;
      STATE.adminUser = result.user;
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
      this.renderDashboard();
      UI.toast('¡Bienvenido al panel admin!', 'success');
    } catch (err) {
      errEl.textContent = err.message || 'Error al iniciar sesión';
    } finally {
      btn.textContent = 'Entrar al Panel';
      btn.disabled = false;
    }
  },

  async logout() {
    await DB.logout();
    STATE.isAdmin = false;
    STATE.adminUser = null;
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    UI.toast('Sesión cerrada', 'info');
  },

  renderDashboard() {
    this.renderStats();
    this.renderModsTable();
    this.renderWikiTable();
  },

  renderStats() {
    const totalDl = STATE.mods.reduce((a, b) => a + (b.downloads || 0), 0);
    document.getElementById('adminStats').innerHTML = `
      <div class="admin-stat-card"><div class="admin-stat-card__val">${STATE.mods.length}</div><div class="admin-stat-card__label">Mods</div></div>
      <div class="admin-stat-card"><div class="admin-stat-card__val">${STATE.skins.length}</div><div class="admin-stat-card__label">Skins</div></div>
      <div class="admin-stat-card"><div class="admin-stat-card__val">${STATE.wiki.length}</div><div class="admin-stat-card__label">Artículos</div></div>
      <div class="admin-stat-card"><div class="admin-stat-card__val">${UI.formatNum(totalDl)}</div><div class="admin-stat-card__label">Descargas</div></div>
    `;
  },

  renderModsTable() {
    const tbody = document.getElementById('adminModsBody');
    tbody.innerHTML = STATE.mods.map(mod => `
      <tr>
        <td><strong>${mod.name}</strong></td>
        <td>${mod.category || '—'}</td>
        <td>${UI.formatNum(mod.downloads || 0)}</td>
        <td>${UI.formatDate(mod.created_at)}</td>
        <td>
          <div class="table-actions">
            <button class="btn-table btn-table--edit" data-id="${mod.id}" data-action="edit">✏️ Editar</button>
            <button class="btn-table btn-table--del"  data-id="${mod.id}" data-action="delete">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mod = STATE.mods.find(m => m.id === parseInt(btn.dataset.id));
        STATE.editingItem = { type: 'mod', id: mod.id };
        Forms.openMod(mod);
      });
    });

    tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar este mod?')) return;
        try {
          await DB.deleteMod(parseInt(btn.dataset.id));
          this.renderModsTable();
          this.renderStats();
          Mods.renderRecent();
          Mods.renderTop10();
          UI.toast('Mod eliminado', 'success');
        } catch (e) {
          UI.toast('Error al eliminar', 'error');
        }
      });
    });
  },

  renderWikiTable() {
    const tbody = document.getElementById('adminWikiBody');
    tbody.innerHTML = STATE.wiki.map(article => `
      <tr>
        <td><strong>${article.title}</strong></td>
        <td>${article.category}</td>
        <td>${UI.formatDate(article.created_at || new Date().toISOString())}</td>
        <td>
          <div class="table-actions">
            <button class="btn-table btn-table--edit" data-id="${article.id}" data-action="edit-wiki">✏️ Editar</button>
            <button class="btn-table btn-table--del"  data-id="${article.id}" data-action="delete-wiki">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-action="edit-wiki"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const article = STATE.wiki.find(w => w.id === parseInt(btn.dataset.id));
        STATE.editingItem = { type: 'wiki', id: article.id };
        Forms.openWiki(article);
      });
    });

    tbody.querySelectorAll('[data-action="delete-wiki"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar este artículo?')) return;
        try {
          await DB.deleteWiki(parseInt(btn.dataset.id));
          this.renderWikiTable();
          this.renderStats();
          UI.toast('Artículo eliminado', 'success');
        } catch (e) {
          UI.toast('Error al eliminar', 'error');
        }
      });
    });
  },
};

/* ================================================================
   FORMS
================================================================ */
const Forms = {
  init() {
    // Mod form close/cancel
    document.getElementById('closeFormModal').addEventListener('click', () => Modal.close('modFormModal'));
    document.getElementById('cancelFormBtn').addEventListener('click', () => Modal.close('modFormModal'));

    // Wiki form close/cancel
    document.getElementById('closeWikiFormModal').addEventListener('click', () => Modal.close('wikiFormModal'));
    document.getElementById('cancelWikiBtn').addEventListener('click', () => Modal.close('wikiFormModal'));

    // Save mod
    document.getElementById('saveModBtn').addEventListener('click', () => this.saveMod());

    // Save wiki
    document.getElementById('saveWikiBtn').addEventListener('click', () => this.saveWiki());

    // Editor tabs (mod description)
    this.initEditor('formModDesc', 'formModDescPreview');
    this.initEditor('formWikiContent', 'formWikiPreview');

    // Upload zone
    const uploadZone = document.getElementById('uploadZone');
    const fileInput  = document.getElementById('formModImage');
    const preview    = document.getElementById('uploadPreview');
    const placeholder = document.getElementById('uploadPlaceholder');

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        fileInput.files = e.dataTransfer.files;
        const url = URL.createObjectURL(file);
        preview.src = url;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
      }
    });

    // Category select populate
    const catSelect = document.getElementById('formModCategory');
    STATE.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.slug;
      opt.textContent = cat.name;
      catSelect.appendChild(opt);
    });
  },

  initEditor(textareaId, previewId) {
    const textarea = document.getElementById(textareaId);
    const preview  = document.getElementById(previewId);
    const tabs = textarea.closest('.editor-wrap').querySelectorAll('.editor-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.editor === 'preview') {
          textarea.style.display = 'none';
          preview.style.display = 'block';
          preview.innerHTML = MD.render(textarea.value);
        } else {
          textarea.style.display = 'block';
          preview.style.display = 'none';
        }
      });
    });
  },

  openMod(mod) {
    document.getElementById('formModalTitle').textContent = mod ? 'Editar Mod' : 'Nuevo Mod';
    document.getElementById('formModName').value        = mod?.name || '';
    document.getElementById('formModCategory').value   = mod?.category || '';
    document.getElementById('formModVersion').value    = mod?.version || '';
    document.getElementById('formModShort').value      = mod?.short_desc || '';
    document.getElementById('formModDesc').value       = mod?.description || '';
    document.getElementById('formModDownloadUrl').value = mod?.download_url || '';
    document.getElementById('formModTags').value       = (mod?.tags || []).join(', ');
    document.getElementById('formModFeatured').checked = mod?.is_featured || false;
    document.getElementById('formStatus').textContent  = '';

    const preview = document.getElementById('uploadPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    if (mod?.image_url) {
      preview.src = mod.image_url;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      preview.src = '';
      preview.style.display = 'none';
      placeholder.style.display = 'flex';
    }

    Modal.open('modFormModal');
  },

  openWiki(article) {
    document.getElementById('wikiFormTitle').textContent = article ? 'Editar Artículo' : 'Nuevo Artículo';
    document.getElementById('formWikiTitle').value   = article?.title || '';
    document.getElementById('formWikiCategory').value = article?.category || '';
    document.getElementById('formWikiOrder').value   = article?.order || 0;
    document.getElementById('formWikiContent').value = article?.content || '';
    document.getElementById('wikiFormStatus').textContent = '';
    Modal.open('wikiFormModal');
  },

  async saveMod() {
    const statusEl = document.getElementById('formStatus');
    const saveBtn  = document.getElementById('saveModBtn');

    const name      = document.getElementById('formModName').value.trim();
    const category  = document.getElementById('formModCategory').value;
    const version   = document.getElementById('formModVersion').value.trim();
    const shortDesc = document.getElementById('formModShort').value.trim();
    const desc      = document.getElementById('formModDesc').value.trim();
    const dlUrl     = document.getElementById('formModDownloadUrl').value.trim();
    const tagsRaw   = document.getElementById('formModTags').value.trim();
    const featured  = document.getElementById('formModFeatured').checked;
    const fileInput = document.getElementById('formModImage');

    if (!name || !category || !shortDesc || !dlUrl) {
      statusEl.textContent = '⚠️ Completa los campos obligatorios';
      statusEl.className = 'form-status form-status--error';
      return;
    }

    saveBtn.textContent = 'Guardando…';
    saveBtn.disabled = true;

    try {
      let imageUrl = STATE.editingItem.id
        ? STATE.mods.find(m => m.id === STATE.editingItem.id)?.image_url || ''
        : '';

      if (fileInput.files[0]) {
        imageUrl = await DB.uploadImage(fileInput.files[0], 'mods');
      }

      const modData = {
        name,
        category,
        version,
        short_desc: shortDesc,
        description: desc,
        download_url: dlUrl,
        tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
        is_featured: featured,
        image_url: imageUrl,
      };

      await DB.saveMod(modData, STATE.editingItem.id);

      // Refresh UI
      STATE.mods = await DB.getMods();
      Mods.renderRecent();
      Mods.renderTop10();
      Hero.render();
      Admin.renderModsTable();
      Admin.renderStats();

      statusEl.textContent = '✅ Mod guardado correctamente';
      statusEl.className = 'form-status form-status--success';
      UI.toast('Mod guardado ✅', 'success');

      setTimeout(() => Modal.close('modFormModal'), 1200);
    } catch (e) {
      statusEl.textContent = `❌ ${e.message}`;
      statusEl.className = 'form-status form-status--error';
    } finally {
      saveBtn.textContent = 'Guardar Mod';
      saveBtn.disabled = false;
    }
  },

  async saveWiki() {
    const statusEl = document.getElementById('wikiFormStatus');
    const saveBtn  = document.getElementById('saveWikiBtn');

    const title    = document.getElementById('formWikiTitle').value.trim();
    const category = document.getElementById('formWikiCategory').value.trim();
    const order    = parseInt(document.getElementById('formWikiOrder').value) || 0;
    const content  = document.getElementById('formWikiContent').value.trim();

    if (!title || !category || !content) {
      statusEl.textContent = '⚠️ Completa los campos obligatorios';
      statusEl.className = 'form-status form-status--error';
      return;
    }

    saveBtn.textContent = 'Guardando…';
    saveBtn.disabled = true;

    try {
      await DB.saveWiki({ title, category, order, content }, STATE.editingItem.id);
      STATE.wiki = await DB.getWiki();
      Wiki.render();
      Admin.renderWikiTable();
      Admin.renderStats();

      statusEl.textContent = '✅ Artículo guardado';
      statusEl.className = 'form-status form-status--success';
      UI.toast('Artículo guardado ✅', 'success');

      setTimeout(() => Modal.close('wikiFormModal'), 1200);
    } catch (e) {
      statusEl.textContent = `❌ ${e.message}`;
      statusEl.className = 'form-status form-status--error';
    } finally {
      saveBtn.textContent = 'Guardar Artículo';
      saveBtn.disabled = false;
    }
  },
};

/* ================================================================
   MODAL CLOSE LISTENERS
================================================================ */
function initModalListeners() {
  document.getElementById('closeModModal').addEventListener('click', () => Modal.close('modModal'));
  document.getElementById('downloadBtn').addEventListener('click', () => {
    if (STATE.selectedMod) Downloads.start(STATE.selectedMod);
  });
}

/* ================================================================
   APP BOOTSTRAP
================================================================ */
async function bootstrap() {
  initSupabase();
  ScrollReveal.init();
  Particles.create();
  Navbar.init();
  Search.init();
  initModalListeners();

  // Load all data
  try {
    [STATE.mods, STATE.skins, STATE.wiki, STATE.categories] = await Promise.all([
      DB.getMods(),
      DB.getSkins(),
      DB.getWiki(),
      DB.getCategories(),
    ]);
  } catch (e) {
    console.error('[MineVault] Data loading error:', e);
    UI.toast('Error cargando datos', 'error');
  }

  // Render home sections
  Hero.render();
  StatsBar.render();
  Categories.render();
  Mods.renderTop10();
  Mods.renderRecent();
  Skins.renderPreview();
  Forms.init();
  Router.init();

  // Hide loader
  UI.hideLoader();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

/* ================================================================
   SUPABASE DB SCHEMA (reference — run in Supabase SQL Editor)

-- categories
CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  slug TEXT UNIQUE NOT NULL
);

-- mods
CREATE TABLE mods (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  short_desc   TEXT,
  description  TEXT,
  image_url    TEXT,
  downloads    INT DEFAULT 0,
  category     TEXT REFERENCES categories(slug),
  version      TEXT,
  tags         TEXT[],
  is_featured  BOOLEAN DEFAULT false,
  download_url TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- skins
CREATE TABLE skins (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  image_url    TEXT,
  download_url TEXT,
  downloads    INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- wiki
CREATE TABLE wiki (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL,
  content    TEXT,
  "order"    INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function: increment_downloads
CREATE OR REPLACE FUNCTION increment_downloads(mod_id INT)
RETURNS void AS $$
  UPDATE mods SET downloads = downloads + 1 WHERE id = mod_id;
$$ LANGUAGE SQL;

-- Storage buckets: mods, skins
-- Enable RLS + policies as needed for your auth setup.

================================================================ */
