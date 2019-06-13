import { Component, OnInit } from '@angular/core';
// RxJS v6+
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaginationService } from '../app/services/pagination.service';
import { ScrollingService } from '../app/services/scrolling.service';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'infinite-scroll';
  users = new BehaviorSubject([]);

  batch = 5; // size of each query
  lastKey = ''; // key to offset next query from
  finished = false; // boolean when end of database is reached

  constructor(
    public pg: PaginationService,
    public scrollService: ScrollingService
  ) {}

  ngOnInit(): void {
    this.pg.init();
   // this.getMoreUsers();
  }

  getMoreUsers() {
    if (this.finished) {
      return;
    }

    this.scrollService
      .getUsersByBatches(this.batch + 1)
      .pipe(
        tap(users => {
          this.lastKey = _.last(users);

          console.log(this.lastKey);
        })
      )
      .subscribe(data => console.log(data));
  }

  onScroll() {
    this.pg.getMore();
  }

  getUsers() {}
}
