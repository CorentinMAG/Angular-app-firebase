import { Injectable } from '@angular/core';
import {Book} from '../models/book.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  books: Book[] = [];
  bookSubject = new Subject<Book[]>();

  constructor() {
    //permet d'appeler la fonction au démarrage de l'application
    //this.getBooks();
  }
  emitBook(){
    this.bookSubject.next(this.books);
  }
  saveBooks() {
    //on accède aux méthode de la database
    //ref() permet de créer un node dans la bdd
    //set est comme put c'est a dire met à jour si les données existent déjà
    firebase.database().ref('/books').set(this.books);
  }
  getBooks(){
    firebase.database().ref('/books')
      .on('value',(data)=>{
        this.books = data.val() ? data.val() : [];
        this.emitBook();
      });
  }
  getSingleBook(id:number){
    return new Promise(
      (resolve,reject)=>{
      firebase.database().ref(`/books/${id}`).once('value').then(
        (data)=>{
          resolve(data.val())
        },
        (error)=>{
          reject(error);
        }
      );
    });
  }
  createNewBook(book:Book){
    this.books.push(book);
    this.saveBooks();
    this.emitBook();
  }
  removeBook(book:Book){
    if(book.photo){
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () =>{
          console.log('photo supprimé');
        }
        ).catch(
        (error)=>{
          console.log('Fichier non trouvé ' +error);
        });
    }
    const bookIndex = this.books.findIndex(
      (element)=>{
        if(element===book){
          return true;
        }
      }
    );
    this.books.splice(bookIndex,1);
    this.saveBooks(); //supprime également le livre du serveur car on remplace l'ancienne ref par la nouvelle
    this.emitBook();

  }
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child(`images/${uniqueFileName}${file.name}`)
          .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
          console.log('chargement...');
          },
          (error) => {
          console.log(`Erreur de chargement : ${error}`);
          reject();
          },
          ()=>{
          resolve(upload.snapshot.ref.getDownloadURL());
          })

      }
    )
  }

}
