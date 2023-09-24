import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = []
  firestore: Firestore = inject(Firestore);
  unsubNotes;
  unsubTrash;

  constructor() { 
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    
  }

  ngonDestroy(){
    this.unsubTrash();
    this.unsubNotes();
  }

  subNotesList(){
    return onSnapshot(this.getNotesRef(), (list) =>{
      this.normalNotes = [];
      list.forEach(element =>{
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    })
  }

  subTrashList(){
    return onSnapshot(this.getTrashRef(), (list) =>{
      this.trashNotes = [];
      list.forEach(element =>{
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    })
  }

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
