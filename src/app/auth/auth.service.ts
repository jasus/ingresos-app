import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  public initAuthListener() {
    this.afAuth.authState
      .subscribe((firebaseUser: firebase.User) => {
        console.log(firebaseUser);
      });
  }

  public isAuth() {
    return this.afAuth.authState.pipe(
      map(firebaseUser => {
        if (firebaseUser == null) {
          this.router.navigate(['/login']);
        }
        return firebaseUser != null;
      })
    );
  }

  public createUser(name: string, email: string, password: string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {

        const user: User = {
          uid: res.user.uid,
          name: name,
          email: res.user.email
        };

        this.afDB.doc(`${ user.uid }/user`)
          .set( user )
          .then(() => {
            this.router.navigate(['/']);
          });
      })
      .catch( error => {
        Swal('Register error', error.message, 'error');
      });
  }

  public login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        this.router.navigate(['/']);
      })
      .catch( error => {
        Swal('Login error', error.message, 'error');
      });
  }

  public signOut() {
    this.afAuth.auth.signOut()
      .then(res => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        Swal('Signout error', error.message, 'error');
      });
  }
}
