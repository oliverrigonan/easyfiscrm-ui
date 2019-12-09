export class SalesDetailModel {
    Id: number;
    BranchId: number;
    SINumber: string;
    SIDate: Date;
    CustomerId: number;
    TermId: number;
    DocumentReference: string;
    ManualSINumber: string;
    Remarks: string;
    Amount: number;
    PaidAmount: number;
    AdjustmentAmount: number;
    BalanceAmount: number;
    SoldById: number;
    PreparedById: number;
    CheckedById: number;
    ApprovedById: number;
    Status: string;
    IsCancelled: Boolean;
    IsPrinted: Boolean;
    IsLocked: Boolean;
    CreatedById: number;
    CreatedDateTime: Date;
    UpdatedById: number;
    UpdatedByDate: Date;
}