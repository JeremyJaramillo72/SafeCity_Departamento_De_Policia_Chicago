import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { IncidentService } from '../../gestion_operativa/services/incident.service';
import { IncidentCacheService } from '../../gestion_operativa/services/incident-cache.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar';
import * as L from 'leaflet';

@Component({
  selector: 'app-incident-form',
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent],
  templateUrl: './incident-form.html',
  styleUrl: './incident-form.css',
})
export class IncidentFormComponent implements OnInit, AfterViewInit, OnDestroy {
  profile: string | null = 'oficial';
  isEditMode = false;
  caseNumberParam = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

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
  };

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
  mapSearchError = '';

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.closeMapModal();
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

  searchStreet() {
    if (!this.mapSearchQuery.trim()) {
      this.mapSearchSuggestions = [];
      return;
    }
    this.isSearchingMap = true;
    this.mapSearchError = '';
    
    const query = encodeURIComponent(this.mapSearchQuery.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${query}, Chicago, IL&format=json&limit=5`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error en el servicio de búsqueda');
        return res.json();
      })
      .then(data => {
        this.isSearchingMap = false;
        this.mapSearchSuggestions = data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
        if (this.mapSearchSuggestions.length === 0) {
          this.mapSearchError = 'No se encontraron resultados en Chicago.';
        }
      })
      .catch(err => {
        this.isSearchingMap = false;
        this.mapSearchError = 'Error al buscar en el mapa.';
        console.error(err);
      });
  }

  selectMapSuggestion(sug: any) {
    if (!this.map) return;
    
    const lat = sug.lat;
    const lng = sug.lng;
    
    this.map.setView([lat, lng], 16);
    
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
    
    this.form.latitude = lat.toFixed(6);
    this.form.longitude = lng.toFixed(6);
    
    this.reverseGeocodeChicago(lat, lng);
    
    this.mapSearchSuggestions = [];
    this.mapSearchQuery = sug.display_name.split(',')[0] + ', ' + sug.display_name.split(',')[1];
    
    setTimeout(() => {
      this.closeMapModal();
    }, 550);
  }

  clearMapSearch() {
    this.mapSearchQuery = '';
    this.mapSearchSuggestions = [];
    this.mapSearchError = '';
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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    if (this.form.latitude && this.form.longitude) {
      const latVal = parseFloat(this.form.latitude);
      const lngVal = parseFloat(this.form.longitude);
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        this.marker = L.marker([latVal, lngVal]).addTo(this.map);
      }
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.form.latitude = lat.toFixed(6);
      this.form.longitude = lng.toFixed(6);

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map!);
      }

      this.reverseGeocodeChicago(lat, lng);

      setTimeout(() => {
        this.closeMapModal();
      }, 350);
    });
  }

  reverseGeocodeChicago(lat: number, lng: number) {
    // Chicago Madison St (0 N/S) at Lat 41.8818, State St (0 E/W) at Lng -87.6278
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

    // Map coordinates to Chicago Districts (001 - 025)
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

    // Map Beat based on district
    const suffix = ['11', '12', '22', '24', '31', '33'][Math.abs(Math.round(lat * 100)) % 6];
    this.form.beat = `${district.substring(1)}${suffix}`;

    // Map Ward (1 - 50)
    this.form.ward = Math.abs(Math.round(lat * 100 + lng * 50)) % 50 + 1;

    // Map Community Area (1 - 77)
    this.form.community_area = Math.abs(Math.round(lat * 80 + lng * 120)) % 77 + 1;
    
    // Pre-select location type
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

  constructor(
    public authService: AuthService,
    private dataService: IncidentService,
    private incidentCache: IncidentCacheService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    if (!this.profile) {
      this.router.navigate(['/login']);
      return;
    }

    this.caseNumberParam = this.route.snapshot.paramMap.get('caseNumber') || '';
    if (this.caseNumberParam) {
      this.isEditMode = true;
      this.prefillFromCache();
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
      };
      this.parseClassificationsFromForm();
    } else {
      // Fetch from API if not in cache
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
          };
          this.parseClassificationsFromForm();
        },
        error: () => {
          this.submitError = 'Could not load incident data for editing.';
        }
      });
    }
  }

  toDatetimeLocal(isoStr: string): string {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    } catch { return ''; }
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.submitError = '';
    this.submitSuccess = false;

    // Sincronizar roster dinámico antes de validar y enviar
    this.syncClassificationsToForm();

    // Validate required fields
    if (!this.form.case_number || !this.form.date || !this.form.block ||
        !this.form.primary_type || !this.form.description) {
      this.submitError = 'Please fill in all required fields: Case Number, Date, Block, Primary Type, and Description.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.form,
      arrest: this.form.arrest ? true : false,
      domestic: this.form.domestic ? true : false,
    };

    const operation = this.isEditMode
      ? this.dataService.updateIncident(this.caseNumberParam, payload)
      : this.dataService.createIncident(payload);

    operation.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/incidents']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.error || 'An error occurred. Please try again.';
      }
    });
  }
}
