import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  Medicines,
  MedicinesService,
} from '../../../shared/services/medicines.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/ui/header/header.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements AfterViewInit {
  medicines: Medicines[] = [];
  filteredMedicines: Medicines[] = [];
  @ViewChild('input') input: ElementRef | undefined;
  @ViewChild('dosage_typeInput') dosage_typeInput: ElementRef | undefined;

  constructor(private medicinesService: MedicinesService) {}
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = [
    'medicine_name',
    'size',
    'packing_size',
    'mrp',
    'manufacturer_name',
    'quantity',
    'content',
    'dosage_type',
  ];
  dataSource = new MatTableDataSource<Medicines>(this.medicines);

  @ViewChild(MatSort) sort!: MatSort;

  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    console.log(sortState);
    
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  ngOnInit(): void {
    this.medicinesService
      .getMedicine({ apikey: 'oORbgJ9u006PfjHQ8ICtFH4mNcwBWBZj' })
      .subscribe((res) => {
        this.medicines = res.data;
        this.dataSource = new MatTableDataSource<Medicines>(this.medicines);
        this.dataSource.sort = this.sort;
      });
  }
  /* getMedicine() {
    console.log(this.medicines);
   return this.medicines; 
  } */

  active: string = 'all';
  search: string = '';
  dosage_type: string = '';

  onClick(value: string) {
    this.active = value;
    this.allFilter();
    /* this.dataSource.filterPredicate = (data: Medicines, filter: string) => {
      //console.log(data);
        console.log(filter);
      switch (filter) {
        case 'all':
          return true;
        case 'available':
          return data.quantity > 0;
        case 'low-stock':
          return data.quantity > 0 && data.quantity <= 30;
        case 'out-of-stock':
          return data.quantity < 0;
        default:
          return false;
      } 
    }; */
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.search = filterValue;
    this.allFilter();
    /* this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: Medicines, filter: string) => {
      console.log(data);

      if (data) {
        return (
          (data.medicine_name || '').toLowerCase().includes(filter) ||
          (data.packing_size || '').toLowerCase().includes(filter) ||
          data.mrp.toString().includes(filter) ||
          (data.manufacturer_name || '').toLowerCase().includes(filter)
        );
      } else {
        return false;
      }
    }; */
  }
  onReload() {
    this.active = 'all';
    this.search = '';
    this.input!.nativeElement.value = '';
    this.dosage_typeInput!.nativeElement.value = '';
    this.dosage_type = '';
    this.medicinesService
      .getMedicine({ apikey: 'oORbgJ9u006PfjHQ8ICtFH4mNcwBWBZj' })
      .subscribe((res) => {
        this.medicines = res.data;
        this.dataSource = new MatTableDataSource<Medicines>(this.medicines);
        this.dataSource.sort = this.sort;
      });
  }

  onChange(event: Event) {
    //tablet, gel, cap
    const filterValue = (event.target as HTMLSelectElement).value
      .trim()
      .toLowerCase();

    this.dosage_type = filterValue;
    this.allFilter();
    /* this.dataSource.filter = filterValue;
    if (filterValue !== this.dataSource.filter) {
      this.dataSource.filter = filterValue;
      if (filterValue === 'all') {
        this.dataSource.filter = '';
        this.dataSource.filterPredicate = (data: Medicines, filter: string) => {
          return true;
        };
      }
      this.dataSource.filterPredicate = (data: Medicines, filter: string) => {
        if (filter) {
          return data.dosage_type.toLowerCase().includes(filter);
        } else {
          return true;
        }
      };
    } */
  }

  allFilter() {
    this.dataSource.filterPredicate = (data: Medicines, filter: string) => {
      //console.log(data);
      
      const matchesStock =
        this.active === 'all' ||
        (this.active === 'available' && data.quantity > 0) ||
        (this.active === 'low-stock' &&
          data.quantity > 0 &&
          data.quantity <= 30) ||
        (this.active === 'out-of-stock' && data.quantity <= 0);

      const matchesSearch = this.search === '' ||
        (data.medicine_name || '').toLowerCase().includes(this.search) ||
        (data.packing_size || '').toLowerCase().includes(this.search) ||
        (data.mrp || '').toString() .includes(this.search) ||
        (data.manufacturer_name || '').toLowerCase().includes(this.search);

      const matchesDosageType =
        this.dosage_type === '' ||
       ( data.dosage_type || '').toLowerCase().includes(this.dosage_type);

       console.log(matchesStock, matchesSearch, matchesDosageType);
       
      return matchesStock && matchesSearch && matchesDosageType;
    };

    this.dataSource.filter = `${this.active}-${this.search}-${this.dosage_type}`;
  }
}
