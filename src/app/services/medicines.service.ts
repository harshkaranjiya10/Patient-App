import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface Medicine {
  dosage_type: string;
  medicine_type: string;
  image: string;
  medicine_id: string;
  schedule_type: string;
  cess_percentage: number;
  salt_content_id: string;
  mrp: number;
  packing_size: string;
  manufacturer_name: string;
  medicine_name: string;
  content: string;
  gst_percentage: number;
  size: number;
  price: number;
  available_for_patient: string;
  slug: string;
  discontinued: string;
  loose_quantity: number;
  sale_discount: number;
  strip_quantity: number;
  is_inventory_available: string;
  sell_in_loose: string;
  thumb_image: string;
  is_rx_required: number;
  packing: string;
  pack_size: string;
}

export interface Result {
  result: Medicine[];
}

export interface searchMedicineResponse {
  status_code: string,
  status_message: string,
  data: Result,
}

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {
  constructor(private http: HttpClient, private router: Router,) { }

  postSearchMedicine(obj: any) {
    return this.http.post<searchMedicineResponse>('https://dev-api.evitalrx.in/v1/patient/medicines/search', obj) 
  }
}
