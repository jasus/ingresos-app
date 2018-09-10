import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DesactivarLoadingAction, ActivarLoadingAction } from '../shared/ui.accions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public type = 'ingreso';
  public isLoading = false;
  public destroy$: Subject<any> = new Subject();

  constructor(private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit() {

    this.form = new FormGroup({
      'description': new FormControl('', Validators.required ),
      'amount': new FormControl(0, [Validators.min(1), Validators.required] )
    });

    this.store.select('ui')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(ui => this.isLoading = ui.isLoading);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    const ingresoEgreso: IngresoEgreso = new IngresoEgreso( {...this.form.value, type: this.type } );

    this.store.dispatch(new ActivarLoadingAction());

    this.ingresoEgresoService.addIngresoEgreso(ingresoEgreso)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe( res => {
        this.form.reset( {amount: 0} );
        Swal('Added successfully', ingresoEgreso.description, 'success');
        this.store.dispatch(new DesactivarLoadingAction());
      }, err => {
        Swal('Something went wrong', ingresoEgreso.description, 'error');
        this.store.dispatch(new DesactivarLoadingAction());
      });

  }

}
