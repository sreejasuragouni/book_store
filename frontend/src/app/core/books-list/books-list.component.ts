import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  public bookList: any = [];
  public payload: any;
  public name;
  public checkOutname;
  public libraryList;
  public checkoutBook;
  public bookDetails;
  public reserveList;
  public quantitySelected;
  public paymentForm: FormGroup;
  constructor(private formBuilder: FormBuilder,public sharedService: SharedService, private sanitizer: DomSanitizer, public router: ActivatedRoute) {
    this.paymentForm = this.addPayment();
   }

  ngOnInit(): void {
    this.payload = JSON.parse(sessionStorage.getItem("payload"));
    console.log(this.router.snapshot.queryParamMap.get('storename'));
    this.name = this.router.snapshot.queryParamMap.get('storename') ?? "";
    this.getRecords();

    console.log(this.payload)
  }
  getRecords() {
    this.sharedService.get("book-list?storename=" + this.name).subscribe(res => {
      this.bookList = res;
      this.getReserveRecords();
    })
  }
  getReserveRecords() {
    this.sharedService.get('reserve-book?userId=' + this.payload.subject).subscribe(res => {
      this.reserveList = res;
      this.reserveList.forEach(element => {
        this.bookList.map(x => {
          if (x._id == element.bookId) {
            x.status = "reserved"
          }
        })
      });
      console.log(this.bookList)
    })
  }
  checkIn(item) {
    console.log(item)
    let date = new Date();
    date.setDate(date.getDate() + 30);
    console.log(date)
    let obj = {
      bookId: item._id,
      name: item.name,
      image: item.image,
      author: item.author,
      publisher: item.publisher,
      department: item.department,
      price: item.price,
      quantity: 1,
      availability: item.availability,
      rent: item.rent,
      description: item.description,
      storename: this.name,
      userId: this.payload.subject,
      status: 'Purchased',
      startDate: (new Date()).toLocaleString('en-US'),
      shelve: item.shelve
    }
    this.paymentRecords = obj
    this.payment = true;
  }

  public submitReserveBook(product) {
    console.log(product)
    let obj = {
      image: product.image,
      name: product.name,
      bookId: product._id,
      description: product.description,
      author: product.author,
      publisher: product.publisher,
      department: product.department,
      price: product.price,
      storename: this.name,
      userId: this.payload.subject
    }
    this.sharedService.post('reserve-book', obj).subscribe(res => {
      this.getRecords()
    })
  }
  public payment = false;
  public paymentRecords;
  public cardType = [{ id: 1, name: 'Credit Card' }, { id: 2, name: 'Debit Card' }]
  addPayment() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      cardtype: ['', Validators.required],
      number: ['', Validators.required],
      date: ['', Validators.required],
      cvv: [null, Validators.required],
    });
  }
  public paymentSuccess() {
    this.payment = false;

    this.paymentRecords['selectedquantity'] = +this.quantitySelected;
    this.sharedService.post('payment',this.paymentForm.value).subscribe((res)=>{

    })
    this.sharedService.post('check-in', this.paymentRecords).subscribe((res) => {
      console.log(res);
      this.getRecords();
    })

  }
}
