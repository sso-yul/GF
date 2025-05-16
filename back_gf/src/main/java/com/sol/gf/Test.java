package com.sol.gf;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;
import java.util.logging.Level;

public class Test {
    private static final Logger LOGGER = Logger.getLogger(Test.class.getName());

    public static void main(String[] args) {
        // 1. LocalDateTime을 사용한 현재 시간 출력 (시스템 기본 시간대)
        LocalDateTime localNow = LocalDateTime.now();
        LOGGER.log(Level.INFO, "현재 시스템 로컬 시간: {0}",
                localNow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 2. ZonedDateTime을 사용한 시스템 기본 시간대 출력
        ZonedDateTime zonedNow = ZonedDateTime.now();
        LOGGER.log(Level.INFO, "현재 시스템 시간대: {0}", zonedNow.getZone());
        LOGGER.log(Level.INFO, "현재 시스템 시간 (시간대 포함): {0}",
                zonedNow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z")));

        // 3. 시스템 기본 시간대 정보 출력
        ZoneId systemZone = ZoneId.systemDefault();
        LOGGER.log(Level.INFO, "시스템 기본 시간대 ID: {0}", systemZone.getId());

        // 4. UTC 시간 출력
        ZonedDateTime utcNow = ZonedDateTime.now(ZoneId.of("UTC"));
        LOGGER.log(Level.INFO, "현재 UTC 시간: {0}",
                utcNow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z")));

        // 5. 서울 시간 출력
        ZonedDateTime seoulNow = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        LOGGER.log(Level.INFO, "현재 서울 시간: {0}",
                seoulNow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z")));
    }
}