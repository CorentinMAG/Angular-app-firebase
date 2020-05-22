import { Component, OnInit } from '@angular/core';
import {Book} from '../../models/book.model';
import {BooksService} from '../../services/books.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

  book: Book;

  constructor(private bookservice:BooksService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.book= new Book('','');
    const id = this.route.snapshot.params['id']; //id sera un string, il faut le caster
    this.bookservice.getSingleBook(+id).then(
      (book:Book)=>{
        this.book = book;
      }
    );
  }
  onBack(){
    this.router.navigate(['/books']);
  }

}
