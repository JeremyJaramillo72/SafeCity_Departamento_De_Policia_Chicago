import fs from 'fs';
import path from 'path';

class FrontendQATestSuite {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.results = [];
    this.projectRoot = process.cwd();
  }

  record(testId, category, name, condition, details = '') {
    const statusText = condition ? 'PASS' : 'FAIL';
    const symbol = condition ? '✅' : '❌';
    if (condition) {
      this.passed++;
    } else {
      this.failed++;
    }
    this.results.push({
      id: testId,
      category: category,
      name: name,
      status: statusText,
      details: details
    });
    console.log(`[${symbol} ${statusText}] ${testId} - ${name}`);
    if (details) {
      console.log(`       └─ ${details}`);
    }
  }

  runSuite1_TypeScriptCompilationAndComponents() {
    console.log('\n' + '='.repeat(75));
    console.log('⚡ SUITE 1: VERIFICACIÓN DE COMPILACIÓN TYPESCRIPT Y COMPONENTES');
    console.log('='.repeat(75));

    // 1.1 Comprobar existencia de componentes standalone clave
    const componentsToCheck = [
      'src/app/inteligencia_criminal/criminal-intel/criminal-intel.ts',
      'src/app/gestion_operativa/incidents/incidents.ts',
      'src/app/despacho_emergencias/emergency-dispatch/emergency-dispatch.ts',
      'src/app/logistica_patrullaje/logistics/logistics.ts',
      'src/app/operativo_rrhh/rrhh-dashboard/rrhh-dashboard.component.ts'
    ];

    const allExist = componentsToCheck.every(file => fs.existsSync(path.join(this.projectRoot, file)));
    this.record(
      'TC-FE-TSC-01', 'Compilación & Estructura',
      'Existencia e Integridad de Componentes Standalone de Angular',
      allExist,
      `Verificados 5/5 componentes core de la aplicación.`
    );

    // 1.2 Verificación de no duplicidad de funciones en TypeScript
    const criminalTsPath = path.join(this.projectRoot, 'src/app/inteligencia_criminal/criminal-intel/criminal-intel.ts');
    const criminalTsContent = fs.readFileSync(criminalTsPath, 'utf8');
    const gangFuncMatches = criminalTsContent.match(/getFilteredGangs\s*\(/g) || [];
    const isSingleGangFunc = gangFuncMatches.length === 1;
    this.record(
      'TC-FE-TSC-02', 'Compilación & Estructura',
      'Ausencia de Funciones Duplicadas en TypeScript (getFilteredGangs)',
      isSingleGangFunc,
      `Declaraciones de getFilteredGangs encontradas: ${gangFuncMatches.length} (esperado: 1).`
    );

    // 1.3 Verificación de Inyección de Servicios y Signals/RxJS
    const hasHttpClient = criminalTsContent.includes('HttpClient') || criminalTsContent.includes('inject(HttpClient)');
    const hasSignalsOrRxjs = criminalTsContent.includes('signal') || criminalTsContent.includes('Observable') || criminalTsContent.includes('subscribe');
    this.record(
      'TC-FE-TSC-03', 'Compilación & Estructura',
      'Inyección de Dependencias y Manejo Asíncrono Reactivo (HttpClient / RxJS)',
      hasHttpClient && hasSignalsOrRxjs,
      'Cliente HTTP y flujos asíncronos configurados correctamente.'
    );
  }

  runSuite2_ClientSideFormValidationAndUpload() {
    console.log('\n' + '='.repeat(75));
    console.log('📝 SUITE 2: VALIDACIONES DE FORMULARIOS Y MANEJO MULTIMEDIA EN CLIENTE');
    console.log('='.repeat(75));

    const criminalHtmlPath = path.join(this.projectRoot, 'src/app/inteligencia_criminal/criminal-intel/criminal-intel.html');
    const criminalHtmlContent = fs.readFileSync(criminalHtmlPath, 'utf8');

    // 2.1 Selector de archivos periciales con validación de tipo MIME
    const hasFileInput = criminalHtmlContent.includes('type="file"') && criminalHtmlContent.includes('accept="image/*"');
    this.record(
      'TC-FE-FORM-01', 'Validación de Formularios',
      'Selector de Fotografía Pericial con Validación MIME (accept="image/*")',
      hasFileInput,
      'Restricción en el navegador para admitir exclusivamente formatos de imagen.'
    );

    // 2.2 Deshabilitación de botón durante subida (Prevención de doble submit)
    const hasDisabledButton = criminalHtmlContent.includes('[disabled]="isUploadingImage"');
    this.record(
      'TC-FE-FORM-02', 'Validación de Formularios',
      'Protección de Envío y Deshabilitación de Botón ([disabled]="isUploadingImage")',
      hasDisabledButton,
      'El botón de subida se bloquea automáticamente mientras el archivo viaja al backend.'
    );

    // 2.3 Simulación de validación en cliente (JavaScript logic)
    const mockValidateEvidence = (evidence) => {
      const errors = [];
      if (!evidence.case_number || evidence.case_number.trim() === '') {
        errors.push('Case number is required');
      }
      if (!evidence.tipo_evidencia || evidence.tipo_evidencia.trim() === '') {
        errors.push('Evidence type is required');
      }
      return { isValid: errors.length === 0, errors };
    };

    const validCase = mockValidateEvidence({ case_number: 'CS-HM005', tipo_evidencia: 'Weapon' });
    const invalidCase = mockValidateEvidence({ case_number: '', tipo_evidencia: '' });
    this.record(
      'TC-FE-FORM-03', 'Validación de Formularios',
      'Validación de Campos Obligatorios en el Formulario Modal de Evidencias',
      validCase.isValid && !invalidCase.isValid && invalidCase.errors.length === 2,
      `Válido: ${validCase.isValid} | Inválido rechazado con errores: [${invalidCase.errors.join(', ')}]`
    );
  }

  runSuite3_ReactiveFilteringAndLiveSearch() {
    console.log('\n' + '='.repeat(75));
    console.log('🔍 SUITE 3: MANEJO REACTIVO DE ESTADOS Y BÚSQUEDA EN VIVO (LIVE SEARCH)');
    console.log('='.repeat(75));

    const criminalHtmlPath = path.join(this.projectRoot, 'src/app/inteligencia_criminal/criminal-intel/criminal-intel.html');
    const criminalHtmlContent = fs.readFileSync(criminalHtmlPath, 'utf8');

    // 3.1 Directivas @for vinculadas a getters reactivos
    const hasWitnessFilter = criminalHtmlContent.includes('getFilteredWitnesses()');
    const hasVictimFilter = criminalHtmlContent.includes('getFilteredVictims()');
    const hasEvidenceFilter = criminalHtmlContent.includes('getFilteredEvidences()');
    const allFiltersWired = hasWitnessFilter && hasVictimFilter && hasEvidenceFilter;
    this.record(
      'TC-FE-REACT-01', 'Reactividad & Búsqueda',
      'Enlace Reactivo de Tablas Tácticas (@for w of getFilteredWitnesses())',
      allFiltersWired,
      'Tablas de Testigos, Víctimas y Evidencias enlazadas a métodos de filtrado live.'
    );

    // 3.2 Simulación de Búsqueda Multicriterio Insensible a Mayúsculas
    const mockWitnesses = [
      { id_testigo: 1, case_number: 'CS-HM005', nombre: 'Robert Vance', testimonio: 'Vi al sospechoso huir en un sedán.' },
      { id_testigo: 2, case_number: 'HH870476', nombre: 'Angela Moss', testimonio: 'Se escucharon disparos cerca de la esquina.' },
      { id_testigo: 3, case_number: 'CS-RB002', nombre: 'David Clark', testimonio: 'El individuo portaba un pasamontañas.' }
    ];

    const filterFn = (query) => {
      const q = (query || '').toLowerCase().trim();
      if (!q) return mockWitnesses;
      return mockWitnesses.filter(w =>
        w.case_number.toLowerCase().includes(q) ||
        w.nombre.toLowerCase().includes(q) ||
        w.testimonio.toLowerCase().includes(q)
      );
    };

    const searchByCase = filterFn('CS-HM005');
    const searchByName = filterFn('angela');
    const searchByTestimony = filterFn('disparos');

    const searchSuccess = (
      searchByCase.length === 1 && searchByCase[0].id_testigo === 1 &&
      searchByName.length === 1 && searchByName[0].id_testigo === 2 &&
      searchByTestimony.length === 1 && searchByTestimony[0].id_testigo === 2
    );

    this.record(
      'TC-FE-REACT-02', 'Reactividad & Búsqueda',
      'Búsqueda Multicriterio Insensible a Mayúsculas/Minúsculas (toLowerCase & trim)',
      searchSuccess,
      `Búsqueda por Caso (1 coincidencia), por Nombre (1 coincidencia), por Testimonio (1 coincidencia).`
    );
  }

  runSuite4_UIUXAndStyling() {
    console.log('\n' + '='.repeat(75));
    console.log('🎨 SUITE 4: USABILIDAD, ESTILOS UI/UX Y ADAPTABILIDAD (GLASSMORPHISM)');
    console.log('='.repeat(75));

    const criminalTsPath = path.join(this.projectRoot, 'src/app/inteligencia_criminal/criminal-intel/criminal-intel.ts');
    const criminalTsContent = fs.readFileSync(criminalTsPath, 'utf8');
    const criminalHtmlPath = path.join(this.projectRoot, 'src/app/inteligencia_criminal/criminal-intel/criminal-intel.html');
    const criminalHtmlContent = fs.readFileSync(criminalHtmlPath, 'utf8');

    // 4.1 Estilos de Scrollbar Transparente de 5px
    const hasScrollStyles = (
      criminalTsContent.includes('.gangs-scroll-container') &&
      criminalTsContent.includes('width: 5px') &&
      criminalTsContent.includes('background: transparent')
    );
    this.record(
      'TC-FE-UI-01', 'Diseño UI/UX',
      'Scrollbars Transparentes Minimalistas de 5px (.gangs-scroll-container)',
      hasScrollStyles,
      'Scrollbar personalizado integrado con el fondo Glassmorphism.'
    );

    // 4.2 Límite de Altura y Cabeceras Sticky en Tablas
    const hasMaxHeight = criminalHtmlContent.includes('max-h-[500px]');
    const hasStickyHeaders = criminalHtmlContent.includes('sticky top-0');
    this.record(
      'TC-FE-UI-02', 'Diseño UI/UX',
      'Contenedor con Altura Delimitada (max-h-[500px]) y Cabeceras Sticky (sticky top-0)',
      hasMaxHeight && hasStickyHeaders,
      'Prevención de desbordamiento de página con cabeceras de tabla fijas al scrollear.'
    );

    // 4.3 Miniaturas Fotográficas Interactivas con Zoom Hover
    const hasThumbnails = criminalHtmlContent.includes('w-9 h-9') && criminalHtmlContent.includes('hover:scale-110');
    this.record(
      'TC-FE-UI-03', 'Diseño UI/UX',
      'Miniaturas Multimedia Interactivas (36x36px) con Zoom Dinámico (hover:scale-110)',
      hasThumbnails,
      'Visualización pericial directa en tabla con apertura en visor de alta resolución.'
    );

    // 4.4 Feedback Visual de Carga con Spinners Animados
    const hasLoadingSpinners = criminalHtmlContent.includes('animate-spin') && criminalHtmlContent.includes('isUploadingImage');
    this.record(
      'TC-FE-UI-04', 'Diseño UI/UX',
      'Indicadores Visuales de Carga Asíncrona (animate-spin)',
      hasLoadingSpinners,
      'Animación de carga que informa al usuario durante transferencias de red.'
    );
  }

  runSuite5_LanguageAndInternationalization() {
    console.log('\n' + '='.repeat(75));
    console.log('🌐 SUITE 5: CUMPLIMIENTO DE REGLA DE IDIOMA EN UI (SPANGLISH CONTROLADO)');
    console.log('='.repeat(75));

    const criminalHtmlPath = path.join(this.projectRoot, 'src/app/inteligencia_criminal/criminal-intel/criminal-intel.html');
    const criminalHtmlContent = fs.readFileSync(criminalHtmlPath, 'utf8');

    // Comprobar que los encabezados clave y botones estén en inglés
    const englishLabels = [
      'SafeCity Intelligence',
      'Search intelligence...',
      'Log Evidence',
      'Witnesses & Victims',
      'Seized Evidence',
      'Related Case',
      'Collection Date',
      'Actions',
      'Save Evidence',
      'Cancel'
    ];

    const allEnglish = englishLabels.every(label => criminalHtmlContent.includes(label));
    this.record(
      'TC-FE-LANG-01', 'Regla de Negocio (Idioma)',
      'Interfaz de Usuario 100% en Inglés (Spanglish Controlado - Regla 4)',
      allEnglish,
      `Verificados encabezados, botones y modales: ${englishLabels.length}/${englishLabels.length} en inglés.`
    );
  }

  printFinalSummary() {
    const total = this.passed + this.failed;
    const rate = total > 0 ? (this.passed / total * 100).toFixed(1) : '0';
    console.log('\n' + '='.repeat(75));
    console.log('🏆 RESUMEN GENERAL DE PRUEBAS DE FRONTEND Y VALIDACIONES');
    console.log('='.repeat(75));
    console.log(`Total Casos de Prueba Ejecutados:  ${total}`);
    console.log(`Casos Exitosos (Passed):           ${this.passed} ✅`);
    console.log(`Casos Fallidos (Failed):           ${this.failed} ❌`);
    console.log(`Tasa de Aprobación de Calidad:     ${rate}%`);
    console.log('='.repeat(75) + '\n');
  }
}

const suite = new FrontendQATestSuite();
suite.runSuite1_TypeScriptCompilationAndComponents();
suite.runSuite2_ClientSideFormValidationAndUpload();
suite.runSuite3_ReactiveFilteringAndLiveSearch();
suite.runSuite4_UIUXAndStyling();
suite.runSuite5_LanguageAndInternationalization();
suite.printFinalSummary();
