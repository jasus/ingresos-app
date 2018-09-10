import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { map, takeUntil } from 'rxjs/operators';

import * as firebase from 'firebase';
import { User } from './user.model';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';
import { AppState } from '../app.reducer';
import { from, Subject, Subscription } from 'rxjs';
import { SetUserAction } from './auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private destroy$: Subject<any> = new Subject();
  private userSubscription: Subscription = new Subscription();

  private user: User;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) { }

  public initAuthListener() {
    this.afAuth.authState
      .subscribe((firebaseUser: firebase.User) => {

        if (firebaseUser) {
           this.userSubscription = this.afDB.doc(`${firebaseUser.uid}/user`).valueChanges()
            .subscribe((user: any) => {
              this.user = new User(user);
              this.store.dispatch( new SetUserAction(this.user));
            });
        } else {
          this.user = null;
          this.userSubscription.unsubscribe();
        }

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

    this.store.dispatch(new ActivarLoadingAction());

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
            this.store.dispatch(new DesactivarLoadingAction());
          });
      })
      .catch( error => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal('Register error', error.message, 'error');
      });
  }

  public login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());

    from(this.afAuth.auth
      .signInWithEmailAndPassword(email, password))
      .subscribe(res => {
        this.router.navigate(['/']);
        this.store.dispatch(new DesactivarLoadingAction());
      }, error => {
        this.store.dispatch(new DesactivarLoadingAction());
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

  public getUser() {
    return {...this.user};
  }
}
