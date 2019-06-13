import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { scan, tap, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(true);
  private _data = new BehaviorSubject([]);

  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  private prepend = false;

  batchSize = 2;

  constructor(public afs: AngularFirestore) { }

  init() {
    console.log('hl');
    const first = this.afs.collection('users', ref => ref.limit(this.batchSize) );

    this.mapAndUpdate(first);

    this.data = this._data.asObservable().pipe(scan((acc, val) => {
      return this.prepend ? val.concat(acc) : acc.concat(val);
    }));
  }

  getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.prepend ? current[0].doc : current[current.length - 1].doc;
    }
  }

  getMore() {
    const cursor = this.getCursor();

    console.log('getMore Users');

    console.log(cursor);

    if (cursor) {
      const more = this.afs.collection('users', ref => {
        return ref.limit(this.batchSize).startAfter(cursor);
      });
      this.mapAndUpdate(more);
    }
  }

  mapAndUpdate(col: AngularFirestoreCollection<any>) {
    // if (this._done || this._loading) { return; }
    // Loading info.
    return col.snapshotChanges().pipe(tap(
      arr => {
        const values = arr.map(snap => {
          // console.log(snap);
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return { ...data, doc };
        });

        this._data.next(values);
        this._loading.next(true);

        if (!values.length) {
          this._loading.next(false);
          this._done.next(true);
        }
      }
    ), take(1)).subscribe();

  }

}
