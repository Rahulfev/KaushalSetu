package com.kaushalsetu.common.util;

import java.security.SecureRandom;

public class OtpUtil {

    private static final SecureRandom RANDOM = new SecureRandom();


    public static String generate() {
        int number = RANDOM.nextInt(1_000_000); // 0 - 999999
        return String.format("%06d", number);
    }
}
