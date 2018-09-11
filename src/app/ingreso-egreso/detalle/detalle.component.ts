import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import * as fromIngresoEgreso from '../ingreso-egreso-reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit {

  public items: IngresoEgreso[];

  constructor(private store: Store<fromIngresoEgreso.AppState>) { }

  ngOnInit() {
    this.store.select('ingresosEgresos')
      .subscribe(ingresosEgresos => {
        this.items = ingresosEgresos.items;
      });
  }

  public borrarItem(uid: string) {
  }

}
