import * as fromIngresoEgreso from './ingreso-egreso-actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AppState } from '../app.reducer';

export interface IngresosEgresosState {
    items: IngresoEgreso[];
}

export interface AppState extends AppState {
    ingresosEgresos: IngresosEgresosState;
}

const initialState: IngresosEgresosState = {
    items: []
};

export function ingresoEgresoReducer( state = initialState, action: fromIngresoEgreso.actions ): IngresosEgresosState {
    switch (action.type) {
        case fromIngresoEgreso.SET_ITEMS:
            return {
                items: [
                    ...action.items.map(item => {
                        return {
                            ...item
                        };
                    })
                ]
            };
        case fromIngresoEgreso.UNSET_ITEMS:
            return {
                items: []
            };
        default:
            return state;
    }
}
