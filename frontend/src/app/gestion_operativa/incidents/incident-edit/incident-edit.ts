import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { AuthService } from '../../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../../../gestion_operativa/services/incident.service';
import { IncidentCacheService } from '../../../gestion_operativa/services/incident-cache.service';
import { CategoryService } from '../../../administracion_seguridad/services/category.service';
import { LogisticsService } from '../../../logistica_patrullaje/services/logistics.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../sidebar/sidebar';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-incident-edit',
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './incident-edit.html',
  styleUrl: '../../incident-form.css', // reuse CSS styles
})
export class IncidentEditComponent implements OnInit, AfterViewInit, OnDestroy {
  showProfileDropdown = false;
  profile: string | null = 'oficial';
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  caseNumberParam = '';

  form: any = {
    case_number: '',
    date: '',
    block: '',
    iucr: '',
    primary_type: '',
    description: '',
    location_description: '',
    district: '',
    ward: '',
    beat: '',
    community_area: '',
    fbi_code: '',
    latitude: '',
    longitude: '',
    arrest: false,
    domestic: false,
    officers_assigned: [] as string[],
    patrol_assigned: '',
    police_report_text: '',
    police_report_file: ''
  };

  availableOfficers: any[] = [];
  availableVehicles: any[] = [];
  patrolShifts: any[] = [];
  policeReportFileObj: File | null = null;

  vehicleSearchQuery: string = '';
  showVehicleDropdown: boolean = false;

  officerSearchQuery: string = '';
  showOfficerDropdown: boolean = false;

  primaryTypes = [
    'BATTERY', 'THEFT', 'CRIMINAL DAMAGE', 'NARCOTICS', 'ASSAULT',
    'DECEPTIVE PRACTICE', 'OTHER OFFENSE', 'BURGLARY', 'MOTOR VEHICLE THEFT',
    'ROBBERY', 'CRIMINAL TRESPASS', 'WEAPONS VIOLATION', 'PUBLIC PEACE VIOLATION',
    'OFFENSE INVOLVING CHILDREN', 'SEX OFFENSE', 'HOMICIDE', 'ARSON',
    'KIDNAPPING', 'STALKING', 'HUMAN TRAFFICKING',
  ];

  locationTypes = [
    'STREET', 'APARTMENT', 'RESIDENCE', 'PARKING LOT / GARAGE (NON RESIDENTIAL)',
    'ALLEY', 'SCHOOL PUBLIC BUILDING', 'SIDEWALK', 'RESTAURANT', 'RETAIL STORE',
    'GAS STATION', 'BANK', 'PARK PROPERTY', 'VEHICLE NON-COMMERCIAL', 'OTHER',
  ];

  districts = [
    '001','002','003','004','005','006','007','008','009','010',
    '011','012','014','015','016','017','018','019','020','022','024','025',
  ];

  iucrDirectory = [
    { code: '0110', primary: 'HOMICIDE', desc: 'FIRST DEGREE MURDER', fbi: '01A' },
    { code: '0130', primary: 'HOMICIDE', desc: 'SECOND DEGREE MURDER', fbi: '01A' },
    { code: '0261', primary: 'SEX OFFENSE', desc: 'AGGRAVATED CRIMINAL SEXUAL ASSAULT', fbi: '02' },
    { code: '0281', primary: 'SEX OFFENSE', desc: 'NON-AGGRAVATED CRIMINAL SEXUAL ASSAULT', fbi: '02' },
    { code: '031A', primary: 'ROBBERY', desc: 'ARMED: HANDGUN', fbi: '03' },
    { code: '0320', primary: 'ROBBERY', desc: 'STRONGARM - NO WEAPON', fbi: '03' },
    { code: '041A', primary: 'ASSAULT', desc: 'AGGRAVATED: HANDGUN', fbi: '04A' },
    { code: '0460', primary: 'BATTERY', desc: 'SIMPLE BATTERY', fbi: '08B' },
    { code: '0486', primary: 'BATTERY', desc: 'DOMESTIC BATTERY SIMPLE', fbi: '08B' },
    { code: '051A', primary: 'BURGLARY', desc: 'FORCIBLE ENTRY', fbi: '05' },
    { code: '0560', primary: 'BURGLARY', desc: 'UNLAWFUL ENTRY', fbi: '05' },
    { code: '0610', primary: 'THEFT', desc: 'OVER $500', fbi: '06' },
    { code: '0620', primary: 'THEFT', desc: '$500 AND UNDER', fbi: '06' },
    { code: '0710', primary: 'MOTOR VEHICLE THEFT', desc: 'AUTOMOBILE', fbi: '07' },
    { code: '0810', primary: 'OTHER OFFENSE', desc: 'SIMPLE ASSAULT', fbi: '04A' },
    { code: '1150', primary: 'DECEPTIVE PRACTICE', desc: 'CREDIT CARD FRAUD', fbi: '11' },
    { code: '1310', primary: 'CRIMINAL DAMAGE', desc: 'TO PROPERTY', fbi: '14' },
    { code: '1320', primary: 'CRIMINAL DAMAGE', desc: 'TO VEHICLE', fbi: '14' },
    { code: '1811', primary: 'NARCOTICS', desc: 'POSS: HEROIN(WHITE)', fbi: '18' },
    { code: '1821', primary: 'NARCOTICS', desc: 'POSS: COCAINE', fbi: '18' },
    { code: '2022', primary: 'NARCOTICS', desc: 'POSS: SYNTHETIC MARIJUANA', fbi: '18' },
    { code: '2091', primary: 'WEAPONS VIOLATION', desc: 'UNLAWFUL USE HANDGUN', fbi: '15' },
    { code: '2440', primary: 'PUBLIC PEACE VIOLATION', desc: 'DISORDERLY CONDUCT', fbi: '24' },
    { code: '2820', primary: 'OTHER OFFENSE', desc: 'TELEPHONE THREATS', fbi: '26' }
  ];

  iucrSuggestions: any[] = [];
  showIucrSuggestions = false;
  iucrSearchQuery = '';
  selectedClassifications: any[] = [];
  showMapModal = false;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  // Tactical map search variables
  mapSearchQuery = '';
  mapSearchSuggestions: any[] = [];
  isSearchingMap = false;
  isPinningLocation = false;
  mapSearchError = '';
  private searchTimeout: any;

  // Combobox variables
  isDistrictDropdownOpen = false;
  districtSearch = '';
  isPrimaryTypeDropdownOpen = false;
  primaryTypeSearch = '';

  get filteredDistricts() {
    const q = this.districtSearch.trim().toLowerCase();
    if (!q) return this.districts;
    return this.districts.filter(d => `Distrito ${d}`.toLowerCase().includes(q) || d.includes(q));
  }

  get filteredPrimaryTypes() {
    const q = this.primaryTypeSearch.trim().toLowerCase();
    if (!q) return this.primaryTypes;
    return this.primaryTypes.filter(t => t.toLowerCase().includes(q));
  }

  selectDistrict(d: string) {
    this.form.district = d;
    this.districtSearch = `Distrito ${d}`;
    this.isDistrictDropdownOpen = false;
  }

  selectPrimaryType(t: string) {
    this.form.primary_type = t;
    this.primaryTypeSearch = t;
    this.isPrimaryTypeDropdownOpen = false;
  }

  openMapModal() {
    this.showMapModal = true;
    this.clearMapSearch();
    setTimeout(() => {
      this.initModalMap();
    }, 150);
  }

  closeMapModal() {
    this.showMapModal = false;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  onSearchQueryChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.fetchMapSuggestions();
    }, 300);
  }

  fetchMapSuggestions() {
    if (!this.mapSearchQuery || this.mapSearchQuery.trim().length < 3) {
      this.mapSearchSuggestions = [];
      return;
    }
    this.isSearchingMap = true;
    this.mapSearchError = '';
    
    const query = encodeURIComponent(this.mapSearchQuery + ', Chicago, IL');
    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`).subscribe({
      next: (res) => {
        this.mapSearchSuggestions = res || [];
        this.isSearchingMap = false;
      },
      error: () => {
        this.isSearchingMap = false;
        this.mapSearchError = 'Error al obtener sugerencias';
      }
    });
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
  }

  selectMapSuggestion(sug: any) {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    
    if (this.map && !isNaN(lat) && !isNaN(lng)) {
      this.map.flyTo([lat, lng], 17, { duration: 1.2 });
      this.form.latitude = lat.toFixed(6);
      this.form.longitude = lng.toFixed(6);

      const customIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/25 border-2 border-primary text-primary shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            <span class="material-symbols-outlined text-[18px] notranslate" translate="no">location_on</span>
          </div>
        `,
        className: 'custom-incident-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
      }

      this.isPinningLocation = true;
      this.mapSearchSuggestions = [];
      this.reverseGeocodeChicago(lat, lng);
    }
  }

  confirmMapLocation() {
    this.closeMapModal();
  }

  searchStreet() {
    if (this.mapSearchSuggestions.length > 0) {
      this.selectMapSuggestion(this.mapSearchSuggestions[0]);
    }
  }

  initModalMap() {
    const container = document.getElementById('modal-incident-map');
    if (!container) return;

    const defaultLat = this.form.latitude ? parseFloat(this.form.latitude) : 41.8781;
    const defaultLng = this.form.longitude ? parseFloat(this.form.longitude) : -87.6298;

    this.map = L.map('modal-incident-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([defaultLat, defaultLng], 12);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(this.map);

    const customIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/25 border-2 border-primary text-primary shadow-[0_0_10px_rgba(59,130,246,0.6)]">
          <span class="material-symbols-outlined text-[18px] notranslate" translate="no">location_on</span>
        </div>
      `,
      className: 'custom-incident-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    if (this.form.latitude && this.form.longitude) {
      const latVal = parseFloat(this.form.latitude);
      const lngVal = parseFloat(this.form.longitude);
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        this.marker = L.marker([latVal, lngVal], { icon: customIcon }).addTo(this.map);
      }
    }

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 100);
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 400);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.ngZone.run(() => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        this.form.latitude = lat.toFixed(6);
        this.form.longitude = lng.toFixed(6);

        if (this.marker) {
          this.marker.setLatLng(e.latlng);
        } else {
          this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map!);
        }

        this.reverseGeocodeChicago(lat, lng);

        setTimeout(() => {
          this.closeMapModal();
        }, 350);
      });
    });
  }

  reverseGeocodeChicago(lat: number, lng: number) {
    const latDiff = lat - 41.8818;
    const lngDiff = lng - (-87.6278);
    
    const blockNum = Math.abs(Math.round((latDiff / 0.0145) * 800));
    const streetNum = Math.abs(Math.round((lngDiff / 0.0195) * 800));
    
    const latDir = latDiff >= 0 ? 'N' : 'S';
    const lngDir = lngDiff >= 0 ? 'E' : 'W';
    
    const northSouthStreets = ['STATE ST', 'MICHIGAN AVE', 'WABASH AVE', 'HALSTED ST', 'ASHLAND AVE', 'DAMEN AVE', 'WESTERN AVE', 'KEDZIE AVE', 'PULASKI RD', 'CICERO AVE'];
    const eastWestStreets = ['MADISON ST', 'WASHINGTON BLVD', 'ROOSEVELT RD', 'CERMAK RD', '31ST ST', 'PERSHING RD', '47TH ST', '55TH ST', '63RD ST', '79TH ST'];
    
    const nsStreet = northSouthStreets[Math.abs(Math.round(streetNum)) % northSouthStreets.length];
    const ewStreet = eastWestStreets[Math.abs(Math.round(blockNum)) % eastWestStreets.length];
    
    let blockAddress = '';
    if (Math.abs(latDiff) > Math.abs(lngDiff)) {
      blockAddress = `${Math.floor(blockNum / 100) * 100}XX ${latDir} ${nsStreet}`;
    } else {
      blockAddress = `${Math.floor(streetNum / 100) * 100}XX ${lngDir} ${ewStreet}`;
    }
    this.form.block = blockAddress;

    let district = '001';
    if (lat > 41.92) {
      district = lng > -87.65 ? '018' : '019';
    } else if (lat < 41.83) {
      district = lng > -87.62 ? '004' : '006';
    } else if (lng < -87.72) {
      district = '015';
    } else if (lat < 41.87 && lng < -87.66) {
      district = '008';
    } else if (lat < 41.87 && lng > -87.66) {
      district = '002';
    } else if (lat >= 41.87 && lng < -87.66) {
      district = '011';
    } else {
      district = '012';
    }
    this.form.district = district;
    this.districtSearch = `District ${district}`;

    const suffix = ['11', '12', '22', '24', '31', '33'][Math.abs(Math.round(lat * 100)) % 6];
    this.form.beat = `${district.substring(1)}${suffix}`;
    this.form.ward = Math.abs(Math.round(lat * 100 + lng * 50)) % 50 + 1;
    this.form.community_area = Math.abs(Math.round(lat * 80 + lng * 120)) % 77 + 1;
    
    const locations = ['STREET', 'SIDEWALK', 'APARTMENT', 'RESIDENCE', 'PARKING LOT / GARAGE (NON RESIDENTIAL)', 'ALLEY', 'RESTAURANT', 'GAS STATION'];
    this.form.location_description = locations[Math.abs(Math.round(lat * 150)) % locations.length];
  }

  searchIucr(term: string) {
    if (!term || term.trim().length === 0) {
      this.iucrSuggestions = [];
      this.showIucrSuggestions = false;
      return;
    }
    const q = term.trim().toLowerCase();
    this.iucrSuggestions = this.iucrDirectory.filter(item => 
      item.code.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.primary.toLowerCase().includes(q) ||
      item.fbi.toLowerCase().includes(q)
    );
    this.showIucrSuggestions = this.iucrSuggestions.length > 0;
  }

  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.showIucrSuggestions = false;
    }, 200);
  }

  syncClassificationsToForm() {
    this.form.iucr = this.selectedClassifications.map(c => c.code).join(', ');
    this.form.description = this.selectedClassifications.map(c => c.desc).join(', ');
    this.form.fbi_code = this.selectedClassifications.map(c => c.fbi).join(', ');
    this.form.primary_type = this.selectedClassifications.map(c => c.primary).join(', ');
  }

  selectIucr(selected: any) {
    if (!this.selectedClassifications.find(c => c.code === selected.code)) {
      this.selectedClassifications.push({
        code: selected.code,
        desc: selected.desc,
        primary: selected.primary,
        fbi: selected.fbi
      });
      this.syncClassificationsToForm();
    }
    this.showIucrSuggestions = false;
    this.iucrSuggestions = [];
    this.form.iucr = '';
    this.form.description = '';
  }

  removeClassification(code: string) {
    this.selectedClassifications = this.selectedClassifications.filter(c => c.code !== code);
    this.syncClassificationsToForm();
  }

  isCopied = false;
  copyToClipboard() {
    if (!this.form.case_number) return;
    navigator.clipboard.writeText(this.form.case_number).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    });
  }

  addCurrentInputAsCustom() {
    if (!this.form.iucr || !this.form.description) return;
    const code = this.form.iucr.trim();
    const desc = this.form.description.trim().toUpperCase();
    const primary = this.form.primary_type.trim().toUpperCase() || 'OTHER OFFENSE';
    const fbi = this.form.fbi_code.trim().toUpperCase() || '26';
    
    if (!this.selectedClassifications.find(c => c.code === code)) {
      this.selectedClassifications.push({ code, desc, primary, fbi });
      this.syncClassificationsToForm();
    }
    this.form.iucr = '';
    this.form.description = '';
    this.showIucrSuggestions = false;
    this.iucrSuggestions = [];
  }

  parseClassificationsFromForm() {
    if (!this.form.iucr) {
      this.selectedClassifications = [];
      return;
    }
    const codes = this.form.iucr.split(',').map((s: string) => s.trim());
    const descriptions = this.form.description.split(',').map((s: string) => s.trim());
    const primaries = this.form.primary_type.split(',').map((s: string) => s.trim());
    const fbis = this.form.fbi_code.split(',').map((s: string) => s.trim());
    
    this.selectedClassifications = [];
    for (let i = 0; i < codes.length; i++) {
      if (codes[i]) {
        this.selectedClassifications.push({
          code: codes[i],
          desc: descriptions[i] || '',
          primary: primaries[i] || '',
          fbi: fbis[i] || ''
        });
      }
    }
    this.form.iucr = '';
    this.form.description = '';
  }

  getFilteredIucrList() {
    const q = this.iucrSearchQuery.trim().toLowerCase();
    if (!q) return this.iucrDirectory;
    return this.iucrDirectory.filter(item => 
      item.code.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.fbi.toLowerCase().includes(q) ||
      item.primary.toLowerCase().includes(q)
    );
  }

  getFilteredVehicles() {
    const q = this.vehicleSearchQuery.trim().toLowerCase();
    if (!q) return this.availableVehicles;
    return this.availableVehicles.filter(v => 
      (v.placa_vehiculo && v.placa_vehiculo.toLowerCase().includes(q)) ||
      (v.tipo_vehiculo && v.tipo_vehiculo.toLowerCase().includes(q))
    );
  }

  selectVehicle(vehicle: any) {
    this.form.patrol_assigned = vehicle.placa_vehiculo + ' (' + vehicle.tipo_vehiculo + ')';
    this.vehicleSearchQuery = '';
    this.showVehicleDropdown = false;
    this.onPatrolChange();
  }

  getFilteredOfficers() {
    const q = this.officerSearchQuery.trim().toLowerCase();
    if (!q) return this.availableOfficers;
    return this.availableOfficers.filter(o => 
      (o.nombres && o.nombres.toLowerCase().includes(q)) ||
      (o.apellidos && o.apellidos.toLowerCase().includes(q)) ||
      (o.placa_policial && o.placa_policial.toLowerCase().includes(q))
    );
  }

  selectOfficer(officer: any) {
    const officerName = `${officer.nombres} ${officer.apellidos}`;
    if (!this.form.officers_assigned.includes(officerName)) {
      this.form.officers_assigned.push(officerName);
    }
    this.officerSearchQuery = '';
    this.showOfficerDropdown = false;
  }

  constructor(
    public authService: AuthService,
    private dataService: IncidentService,
    private incidentCache: IncidentCacheService,
    private logisticsService: LogisticsService,
    public router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories('primary_type', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.primaryTypes = cats.map(c => c.valor);
        }
      },
      error: (err) => console.error('Failed to load primary types:', err)
    });
    this.categoryService.getCategories('location_type', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.locationTypes = cats.map(c => c.valor);
        }
      },
      error: (err) => console.error('Failed to load location types:', err)
    });
    this.categoryService.getCategories('district', false).subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.districts = cats.map(c => c.valor);
        }
      },
      error: (err) => console.error('Failed to load districts:', err)
    });

    this.logisticsService.getOfficers().subscribe({
      next: (data: any) => this.availableOfficers = data,
      error: (err: any) => console.error('Failed to load officers', err)
    });
    this.logisticsService.getVehicles().subscribe({
      next: (data: any) => this.availableVehicles = data,
      error: (err: any) => console.error('Failed to load vehicles', err)
    });
    this.logisticsService.getPatrolShifts().subscribe({
      next: (data: any) => this.patrolShifts = data,
      error: (err: any) => console.error('Failed to load patrol shifts', err)
    });
    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
      return;
    }

    this.caseNumberParam = this.route.snapshot.paramMap.get('caseNumber') || '';
    if (this.caseNumberParam) {
      this.prefillFromCache();
    } else {
      this.router.navigate(['/incidents']);
    }
  }

  prefillFromCache() {
    const cached = this.incidentCache.get();
    if (cached && cached.case_number === this.caseNumberParam) {
      this.form = {
        case_number: cached.case_number || '',
        date: this.toDatetimeLocal(cached.date),
        block: cached.block || '',
        iucr: cached.iucr || '',
        primary_type: cached.primary_type || '',
        description: cached.description || '',
        location_description: cached.location_description || '',
        district: cached.district || '',
        ward: cached.ward || '',
        beat: cached.beat || '',
        community_area: cached.community_area || '',
        fbi_code: cached.fbi_code || '',
        latitude: cached.latitude || '',
        longitude: cached.longitude || '',
        arrest: cached.arrest || false,
        domestic: cached.domestic || false,
        officers_assigned: cached.officers_assigned || [],
        patrol_assigned: cached.patrol_assigned || '',
        police_report_text: cached.police_report_text || '',
        police_report_file: cached.police_report_file || ''
      };
      this.districtSearch = cached.district ? `Distrito ${cached.district}` : '';
      this.primaryTypeSearch = cached.primary_type || '';
      this.parseClassificationsFromForm();
    } else {
      this.dataService.getIncidentDetail(this.caseNumberParam).subscribe({
        next: (data) => {
          this.form = {
            case_number: data.case_number || '',
            date: this.toDatetimeLocal(data.date),
            block: data.block || '',
            iucr: data.iucr || '',
            primary_type: data.primary_type || '',
            description: data.description || '',
            location_description: data.location_description || '',
            district: data.district || '',
            ward: data.ward || '',
            beat: data.beat || '',
            community_area: data.community_area || '',
            fbi_code: data.fbi_code || '',
            latitude: data.latitude || '',
            longitude: data.longitude || '',
            arrest: data.arrest || false,
            domestic: data.domestic || false,
            officers_assigned: data.officers_assigned || [],
            patrol_assigned: data.patrol_assigned || '',
            police_report_text: data.police_report_text || '',
            police_report_file: data.police_report_file || ''
          };
          this.districtSearch = data.district ? `Distrito ${data.district}` : '';
          this.primaryTypeSearch = data.primary_type || '';
          this.parseClassificationsFromForm();
        },
        error: () => {
          this.submitError = 'No se pudieron cargar los datos del incidente para editar.';
        }
      });
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.closeMapModal();
  }

  toDatetimeLocal(isoStr: string): string {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toISOString().slice(0, 16);
    } catch { return ''; }
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.submitError = '';
    this.submitSuccess = false;

    if (this.selectedClassifications.length > 0) {
      this.syncClassificationsToForm();
    }

    if (!this.form.case_number || !this.form.date || !this.form.block ||
        !this.form.primary_type || !this.form.description) {
      this.submitError = 'Por favor complete todos los campos obligatorios: Número de Caso, Fecha, Cuadra/Dirección, Tipo Principal y Descripción.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.form,
      arrest: this.form.arrest ? true : false,
      domestic: this.form.domestic ? true : false,
    };

    if (this.policeReportFileObj) {
      const formData = new FormData();
      formData.append('file', this.policeReportFileObj);
      this.http.post<any>('http://localhost:8000/api/criminal/evidence/upload/', formData).subscribe({
        next: (res) => {
          payload.police_report_file = res.url;
          this.processSubmit(payload);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError = 'Error al cargar el archivo del informe policial.';
        }
      });
    } else {
      this.processSubmit(payload);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.policeReportFileObj = event.target.files[0];
    }
  }

  onPatrolChange() {
    if (!this.form.patrol_assigned) return;
    const plate = this.form.patrol_assigned.split(' ')[0];
    const relatedShifts = this.patrolShifts.filter(s => s.vehicle_plate === plate);
    
    if (relatedShifts.length > 0) {
      relatedShifts.forEach(shift => {
        let officerName = '';
        if (shift.officer_name) {
           officerName = shift.officer_name;
        }
        if (officerName && !this.form.officers_assigned.includes(officerName)) {
           this.form.officers_assigned.push(officerName);
        }
      });
    }
  }

  removeOfficer(officer: string) {
    this.form.officers_assigned = this.form.officers_assigned.filter((o: string) => o !== officer);
  }

  addExtraOfficer(event: any) {
    const val = event.target.value;
    if (val && !this.form.officers_assigned.includes(val)) {
      this.form.officers_assigned.push(val);
    }
    event.target.value = "";
  }

  private processSubmit(payload: any) {
    this.dataService.updateIncident(this.caseNumberParam, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/incidents', this.caseNumberParam]);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.error || 'Ocurrió un error. Por favor intente nuevamente.';
      }
    });
  }

  showCustomTypeModal = false;
  customTypeInput = '';
  openCustomTypeModal() {
    this.showCustomTypeModal = true;
    this.customTypeInput = '';
  }
  cancelCustomTypeModal() {
    this.showCustomTypeModal = false;
  }
  saveCustomPrimaryType() {
    if (this.customTypeInput.trim()) {
      const code = '9999';
      const desc = this.customTypeInput.trim().toUpperCase();
      const primary = 'OTHER OFFENSE';
      const fbi = '26';
      
      if (!this.selectedClassifications.find(c => c.code === code)) {
        this.selectedClassifications.push({ code, desc, primary, fbi });
        this.syncClassificationsToForm();
      }
      this.showCustomTypeModal = false;
    }
  }
}
