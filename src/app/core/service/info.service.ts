import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  public baseUrl = 'http://localhost:3000';
  // public baseUrl = 'http://91.171.162.89:38066';


  constructor() { }
}
