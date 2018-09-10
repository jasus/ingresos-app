import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso-actions';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private afDB: AngularFirestore, private authService: AuthService, private store: Store<AppState> ) { }

  public initIngresoEgresoListener() {
    this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(auth => {
        this.ingresoEgresoItems(auth.user.uid);
      });

  }

  public addIngresoEgreso( ingresoEgreso: IngresoEgreso ): Observable<any> {
    return from(this.afDB.doc(`${this.authService.getUser().uid}/ingresos-egresos`)
      .collection('items').add({...ingresoEgreso}));
  }

  private ingresoEgresoItems( uid: string) {
    this.afDB.collection(`${uid}/ingresos-egresos/items/`)
      .snapshotChanges()
      .pipe(
        map(docData => {
          return docData.map(doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe((collection: any[]) => {
        this.store.dispatch(new SetItemsAction( collection ));
      });
  }
}
