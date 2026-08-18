package com.kaushalsetu.common.util;

import java.util.List;


public class CountryCodeData {

    public record CountryCode(String name, String iso2, String dialCode) {}

    public static final List<CountryCode> ALL = List.of(
            new CountryCode("India", "IN", "+91"),
            new CountryCode("United States", "US", "+1"),
            new CountryCode("United Kingdom", "GB", "+44"),
            new CountryCode("United Arab Emirates", "AE", "+971"),
            new CountryCode("Australia", "AU", "+61"),
            new CountryCode("Canada", "CA", "+1"),
            new CountryCode("Germany", "DE", "+49"),
            new CountryCode("France", "FR", "+33"),
            new CountryCode("Italy", "IT", "+39"),
            new CountryCode("Spain", "ES", "+34"),
            new CountryCode("Netherlands", "NL", "+31"),
            new CountryCode("Singapore", "SG", "+65"),
            new CountryCode("Malaysia", "MY", "+60"),
            new CountryCode("Saudi Arabia", "SA", "+966"),
            new CountryCode("Qatar", "QA", "+974"),
            new CountryCode("Kuwait", "KW", "+965"),
            new CountryCode("Oman", "OM", "+968"),
            new CountryCode("Bahrain", "BH", "+973"),
            new CountryCode("Bangladesh", "BD", "+880"),
            new CountryCode("Pakistan", "PK", "+92"),
            new CountryCode("Sri Lanka", "LK", "+94"),
            new CountryCode("Nepal", "NP", "+977"),
            new CountryCode("China", "CN", "+86"),
            new CountryCode("Japan", "JP", "+81"),
            new CountryCode("South Korea", "KR", "+82"),
            new CountryCode("Indonesia", "ID", "+62"),
            new CountryCode("Philippines", "PH", "+63"),
            new CountryCode("Thailand", "TH", "+66"),
            new CountryCode("Vietnam", "VN", "+84"),
            new CountryCode("South Africa", "ZA", "+27"),
            new CountryCode("Nigeria", "NG", "+234"),
            new CountryCode("Kenya", "KE", "+254"),
            new CountryCode("Egypt", "EG", "+20"),
            new CountryCode("Brazil", "BR", "+55"),
            new CountryCode("Mexico", "MX", "+52"),
            new CountryCode("Russia", "RU", "+7"),
            new CountryCode("New Zealand", "NZ", "+64"),
            new CountryCode("Ireland", "IE", "+353"),
            new CountryCode("Switzerland", "CH", "+41"),
            new CountryCode("Sweden", "SE", "+46"),
            new CountryCode("Norway", "NO", "+47")
    );

    public static boolean isValidDialCode(String dialCode) {
        if (dialCode == null) return false;
        return ALL.stream().anyMatch(c -> c.dialCode().equals(dialCode.trim()));
    }
}
