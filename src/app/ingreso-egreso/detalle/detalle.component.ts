import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit {

  public items: IngresoEgreso[];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('ingresosEgresos')
      .subscribe(ingresosEgresos => {
        this.items = ingresosEgresos.items;
      });
  }

  public borrarItem(uid: string) {
  }

}
