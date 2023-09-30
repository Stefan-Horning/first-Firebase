import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, onSnapshot,addDoc, } from '@angular/fire/firestore';
import { doc, updateDoc } from "firebase/firestore";
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

  async updateNote(note: Note ){
    if(note.id){
      let docRef = this.getsingelDocRef(this.getColIdFromNote(note),note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      );
    }
  }

  getCleanJson(note :Note): {} {

    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note:Note){
    if(note.type == 'note'){
      return 'notes';
    }else{
      return 'trash';
    }
  }

  async addNote(item:Note){
    await addDoc(this.getNotesRef(),item).catch(
      (err) => { console.warn(err)}
    ).then(
      (docRef) => {console.log(docRef?.id)}
    );

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
