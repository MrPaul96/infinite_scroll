import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { scan, tap, take, last, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class ScrollingService {

  constructor(public angularFireStore: AngularFirestore) { }

  getUsersCollection(): AngularFirestoreCollection<User> {
    return this.angularFireStore.collection<User>('users');
  }

  getCandidates(): any {
    const userCollection = this.getUsersCollection();
    console.log('hola');
    return userCollection
      .snapshotChanges()
      .pipe(map(changes => console.log(changes)));
  }

  handleUserData(changes) {
    return changes
      .map(action => this.getUserData(action))
      .filter((user: User) => this.verficateCandidate(user));
  }

  getUserData(action): User {
    return action.payload.doc.data() as User;
  }

  verficateCandidate(user: User): User {
    if (user.roles.candidate) {
      return user;
    }
  }

  getUsersByBatches(batch, lastKey?) {
    let userCollection;
    console.log('what');

    userCollection =  this.angularFireStore.collection('users', ref => {
      return ref.limit(batch).orderBy('age').startAt(2);
    });

    return userCollection.snapshotChanges().pipe(map(changes => this.handleUserData(changes)));
  }

  getUsers() {

    const userCollection =  this.angularFireStore.collection('users');
    return userCollection.snapshotChanges().pipe(map(changes => this.handleUserData(changes)));
  }

}
