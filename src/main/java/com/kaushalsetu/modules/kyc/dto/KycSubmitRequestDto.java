package com.kaushalsetu.modules.kyc.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class KycSubmitRequestDto {

    // ── Personal details ──
    private String fullName;
    private String dateOfBirth; // yyyy-MM-dd
    private String gender;
    private String mobileNumber;
    private String email;
   // private MultipartFile profilePhoto; // omit to keep existing on resubmission

    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    // ── Identity document ──
    private String documentType;
    private String documentNumber;
   // private MultipartFile documentFront;
    // private MultipartFile documentBack; // required only for AADHAAR / DRIVING_LICENSE / VOTER_ID

    // ── Payment / payout details ──
    private String payoutMethod; // UPI or BANK_ACCOUNT
    private String upiId;
    private String bankAccountHolderName;
    private String bankName;
    private String bankAccountNumber;
    private String ifscCode;
}
