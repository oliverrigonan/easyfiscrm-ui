export class SalesListModel {
    Id: number;
    BranchId: number;
    SINumber: number;
    SIDate: Date;
    CustomerId: number;
    TermId: number;
    DocumentReference: string;
    ManualSINumber: string;
    Remarks: string;
    Amount: number;
    PaidAmount: number;
    AdjustmentAmount: number;
    BalanceAmount: number
    SoldById: number;
    PreparedById: number;
    CheckedById: number;
    ApprovedById: number;
    Status: string;
    IsCancelled: boolean;
    IsPrinted: boolean;
}