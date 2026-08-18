package com.kaushalsetu.common.enums;

public enum ApplicationStatus {
    // Shared with the Organization contract flow (unaffected by the values below):
    APPLIED,
    SHORTLISTED,
    REJECTED,

    // Client household-hiring flow: Applied -> Assigned -> Ongoing -> Completed -> Paid -> Closed
    ASSIGNED,
    ONGOING,
    COMPLETED,
    PAID,
    CLOSED,
    CANCELLED
}
