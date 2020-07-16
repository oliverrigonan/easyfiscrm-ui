export class SoftwareDevelopentModel {
    Id: number;
    SDNumber: string;
    SDDate: string;
    ProductId: number;
    ProductDescription: string;
    Issue: string;
    IssueType: string;
    Remarks: string;
    AssignedToUserId: number;
    AssignedToUserFullname: string;
    TargetDateTime: Date;
    CloseDateTime: Date;
    Status: string;
    IsLocked: string;
    CreatedByUserId: number;
    CreatedByUserFullname: string;
    CreatedDateTime: Date;
    UpdatedByUserId: number;
    UpdatedByUserFullname: string;
    UpdatedDateTime: Date;
}