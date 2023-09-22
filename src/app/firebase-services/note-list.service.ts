import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);

  constructor() { }

  //const itemCollection = collection(this.firestore, 'items');

  getNoteRef(){
    return collection(this.firestore, 'notes');
  }

  getTrashRef(){
    return collection(this.firestore, 'trash');
  }
}
