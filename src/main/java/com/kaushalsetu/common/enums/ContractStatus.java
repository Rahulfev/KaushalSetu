package com.kaushalsetu.common.enums;

public enum ContractStatus {
    NEGOTIATION,          // Terms being discussed between org/client and worker
    PENDING_ACCEPTANCE,   // Contract generated, waiting for worker to accept/reject
    ACCEPTED,             // Worker accepted. Org flow: waiting for escrow funding. Client flow: ready to start.
    ACTIVE,               // Org flow: escrow funded, work may start. Client flow: worker started work.
    WORK_SUBMITTED,       // Worker marked work/milestones as completed, awaiting approval/payment
    COMPLETED,            // Approved + payment released + worker wallet credited
    REJECTED,             // Worker rejected the contract
    CANCELLED,            // Cancelled by either party before completion
    DISPUTED              // Under dispute resolution
}
