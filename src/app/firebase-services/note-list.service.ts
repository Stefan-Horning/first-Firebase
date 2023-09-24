import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);
  items$;
  items;
  unsubList;

  constructor() { 
    this.unsubList = onSnapshot(this.getNotesRef(), (list) =>{
      list.forEach(element =>{
        console.log(this.setNoteObject(element.data(), element.id));
        console.log(element.data());
      })
    })






    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe( (list) => {
      list.forEach(element => {
        console.log(element)
      });
    } );
    
  }

  ngonDestroy(){
    this.items.unsubscribe();
    this.unsubList();
  }

  //const itemCollection = collection(this.firestore, 'items');

  getNotesRef(){
    return collection(this.firestore, 'notes');
  }

  getTrashRef(){
    return collection(this.firestore, 'trash');
  }

  getsingelDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId) ,docId)
  }

  setNoteObject(obj:any, id:string): Note{
    return {
      id:id,
      type: obj.type || "",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }
  
}
