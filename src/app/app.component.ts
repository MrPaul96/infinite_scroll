import { Component, OnInit} from '@angular/core';
// RxJS v6+
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';
import { PaginationService } from '../app/services/pagination.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'infinite-scroll';

  constructor(public pg: PaginationService) {
  }

  ngOnInit(): void {
    this.pg.init();
  }

  scrollHandler(e) {
    console.log(e);
    if ( e === 'bottom') {
      this.pg.getMore();
    }
  }
}
