import * as fromIngresoEgreso from './ingreso-egreso-actions';
import { IngresoEgreso } from './ingreso-egreso.model';

export interface IngresosEgresosState {
    items: IngresoEgreso[];
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
