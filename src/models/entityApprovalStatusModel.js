import {
    ModelGeneral as General,
    EntityApprovalStatus,
    ApprovalStatus,
} from "openchs-models";
import {isNil} from 'lodash';

export function mapEntityApprovalStatuses(list) {
    return isNil(list) ? [] : list.map((x) => mapEntityApprovalStatus(x));
}

function mapEntityApprovalStatus(resource) {
    if (isNil(resource)) {
        return null;
    }
    const entityApprovalStatus = General.assignFields(resource, new EntityApprovalStatus(),
        ["uuid", "entityType", "approvalStatusComment", "autoApproved", "voided", "entityUUID"],
        ["statusDateTime"]);
    entityApprovalStatus.approvalStatus = mapApprovalStatus(resource.approvalStatus);
    return entityApprovalStatus;
}

function mapApprovalStatus(resource) {
    return General.assignFields(resource, new ApprovalStatus(),
        ["uuid", "status", "voided"]);
}
