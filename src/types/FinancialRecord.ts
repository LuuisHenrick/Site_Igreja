export class FinancialRecord {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    status: string;
    created_at: string;

    constructor(data: FinancialRecord) {
        this.id = data.id;
        this.type = data.type;
        this.amount = data.amount;
        this.category = data.category;
        this.description = data.description;
        this.date = data.date;
        this.status = data.status;
        this.created_at = data.created_at;
    }
}