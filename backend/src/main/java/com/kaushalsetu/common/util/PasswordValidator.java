package com.kaushalsetu.common.util;

import java.util.regex.Pattern;

public class PasswordValidator {

    private static final String PASSWORD_REGEX =
            "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$";

    private static final Pattern pattern =
            Pattern.compile(PASSWORD_REGEX);

    public static boolean isValid(String password) {
        return pattern.matcher(password).matches();
    }
}
