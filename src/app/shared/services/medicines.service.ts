import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Medicines {
  medicine_id: string,
  manufacturer_name: string,
  size: number,
  packing_size: string,
  mrp: number,
  medicine_name: string,
  quantity: number,
  content: string,
  dosage_type: string

}

export interface MedicinesResponse {
  status_code: string;
  status_message: string;
  data: Medicines[];
} 

@Injectable({
  providedIn: 'root'
})


export class MedicinesService {
  private medicinesSubject = new BehaviorSubject<Medicines[]>([]);
  medicines$ = this.medicinesSubject.asObservable();
  constructor(private http: HttpClient) { }


  getMedicine(params: { apikey: string }): Observable<MedicinesResponse> {
    return this.http
      .post<MedicinesResponse>(
        'https://dev-api.evitalrx.in/v1/doctor/medicines/get_inventory_items',
        params
      )
      .pipe(
        tap((res) => {
          if (res.status_code === '1' && res.data) {
            this.medicinesSubject.next(res.data);
          }
        })
      );
  }
}
