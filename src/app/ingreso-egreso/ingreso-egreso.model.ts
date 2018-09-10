export class IngresoEgreso {
    description: string;
    amount: number;
    type: string;
    uid?: string;

    constructor( obj ) {
        this.description  = obj && obj.description || null;
        this.amount       = obj && obj.amount      || 0;
        this.type         = obj && obj.type        || null;
        // this.uid          = obj && obj.uid         || null;
    }
}
