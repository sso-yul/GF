package com.sol.gf.domain.schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDto {
    private long scheduleNo;
    private String scheduleTitle;
    private String scheduleContent;
    private LocalDateTime scheduleStart;
    private LocalDateTime scheduleEnd;
    private boolean scheduleAllDay;
    private ScheduleType scheduleType;
    private boolean scheduleEditable;

    private Long userNo;
    private Long scheduleColor;

    public enum ScheduleType {
        HOLIDAY,
        USER
    }
}
