package com.kaushalsetu.common.util;

import java.util.regex.Pattern;

public class PhoneValidator {


    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9]{6,14}$");


    private static final Pattern DIAL_CODE_PATTERN = Pattern.compile("^\\+[0-9]{1,4}$");

    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    public static boolean isValidDialCodeFormat(String dialCode) {
        return dialCode != null && DIAL_CODE_PATTERN.matcher(dialCode.trim()).matches();
    }


    public static boolean isValid(String dialCode, String phone) {
        return isValidDialCodeFormat(dialCode)
                && CountryCodeData.isValidDialCode(dialCode)
                && isValidPhone(phone);
    }
}
