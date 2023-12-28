import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, query, where, collection, collectionData, onSnapshot,addDoc,doc, updateDoc, deleteDoc, limit, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];
  firestore: Firestore = inject(Firestore);
  unsubNotes;
  unsubTrash;
  unsubMarkedNotes;

  constructor() { 
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    
  }

  async updateNote(note: Note ){
    if(note.id){
      let docRef = this.getsingelDocRef(this.getColIdFromNote(note),note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      );
    }
  }

  async deleteNote(colId: "notes" | "trash", docId:string){
    await deleteDoc(this.getsingelDocRef(colId,docId)).catch(
      (err) => { console.log(err) }
    );
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

  async addNote(item:Note, colId: "notes" | "trash"){
    await addDoc(this.getNotesRef(colId),item).catch(
      (err) => { console.warn(err)}
    ).then(
      (docRef) => {console.log(docRef?.id)}
    );

  }

  ngonDestroy(){
    this.unsubTrash();
    this.unsubNotes();
    this.unsubMarkedNotes();
  }

  subNotesList(){
    const q = query(this.getNotesRef('notes'));
    return onSnapshot(q, (list) =>{
      this.normalNotes = [];
      list.forEach(element =>{
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    })
  }

  subMarkedNotesList(){
    const q = query(this.getNotesRef('notes'),where("marked","==",true));
    return onSnapshot(q, (list) =>{
      this.normalMarkedNotes = [];
      list.forEach(element =>{
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
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

  getNotesRef(calId:string){
    return collection(this.firestore, calId);
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
