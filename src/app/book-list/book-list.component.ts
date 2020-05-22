import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book} from '../models/book.model';
import {Subscription} from 'rxjs';
import {BooksService} from '../services/books.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[];
  booksSubscription: Subscription;

  constructor(private bookservice: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.booksSubscription = this.bookservice.bookSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
      }
    );
    this.bookservice.getBooks();
    this.bookservice.emitBook();
  }
  onNewBook() {
    this.router.navigate(['/books', 'new']); // equivalent à /books/new
  }
  onDeleteBook(book: Book) {
    this.bookservice.removeBook(book);
  }
  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }
  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe();
  }


}
