import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject();

  public isLoading: boolean;

  constructor(private authService: AuthService, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('ui')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe( ui => this.isLoading = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(data) {
    this.authService.createUser(data.name, data.email, data.password);
  }

}
