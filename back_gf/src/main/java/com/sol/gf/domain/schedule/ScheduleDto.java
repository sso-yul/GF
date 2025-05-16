package com.sol.gf.domain.schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDto {
    private long scheduleNo;
    private String scheduleTitle;
    private String scheduleContent;
    private ZonedDateTime scheduleStart;
    private ZonedDateTime scheduleEnd;
    private boolean scheduleAllDay;
    private ScheduleType scheduleType;
    private boolean scheduleEditable;

    private Long scheduleColor;
    private String scheduleColorName;

    public enum ScheduleType {
        HOLIDAY,
        USER
    }
}
