package com.kaushalsetu.common.util;

import java.util.regex.Pattern;

public class DocumentValidator {

    private static final Pattern AADHAAR_PATTERN = Pattern.compile("^[0-9]{12}$");

    private static final Pattern PAN_PATTERN = Pattern.compile("^[A-Z]{5}[0-9]{4}[A-Z]{1}$");
    private static final Pattern DL_PATTERN = Pattern.compile("^[A-Z]{2}[0-9]{2}\\s?[0-9]{4,11}$");
    private static final Pattern PASSPORT_PATTERN = Pattern.compile("^[A-PR-WYa-pr-wy][1-9][0-9]\\s?[0-9]{4}[1-9]$");
    private static final Pattern VOTER_ID_PATTERN = Pattern.compile("^[A-Z]{3}[0-9]{7}$");
    private static final Pattern IFSC_PATTERN = Pattern.compile("^[A-Z]{4}0[A-Z0-9]{6}$");
    private static final Pattern UPI_PATTERN = Pattern.compile("^[\\w.\\-]{2,256}@[a-zA-Z][\\w]{2,64}$");

    public static final java.util.List<String> SUPPORTED_TYPES =
            java.util.List.of("AADHAAR", "PAN", "DRIVING_LICENSE", "PASSPORT", "VOTER_ID");


    public static final java.util.List<String> REQUIRES_BACK_IMAGE =
            java.util.List.of("AADHAAR", "DRIVING_LICENSE", "VOTER_ID");

    public static boolean isValidDocumentNumber(String documentType, String documentNumber) {
        if (documentType == null || documentNumber == null) return false;

        String number = documentNumber.trim().toUpperCase();

        return switch (documentType.trim().toUpperCase()) {
            case "AADHAAR" -> AADHAAR_PATTERN.matcher(number).matches();
            case "PAN" -> PAN_PATTERN.matcher(number).matches();
            case "DRIVING_LICENSE" -> DL_PATTERN.matcher(number).matches();
            case "PASSPORT" -> PASSPORT_PATTERN.matcher(number).matches();
            case "VOTER_ID" -> VOTER_ID_PATTERN.matcher(number).matches();
            default -> false;
        };
    }

    public static boolean isValidIfsc(String ifsc) {
        return ifsc != null && IFSC_PATTERN.matcher(ifsc.trim().toUpperCase()).matches();
    }

    public static boolean isValidUpi(String upiId) {
        return upiId != null && UPI_PATTERN.matcher(upiId.trim()).matches();
    }

    public static boolean isValidPincode(String pincode) {
        return pincode != null && pincode.trim().matches("^[1-9][0-9]{5}$");
    }

    public static boolean isValidMobile(String mobile) {
        return mobile != null && mobile.trim().matches("^[6-9][0-9]{9}$");
    }
}
