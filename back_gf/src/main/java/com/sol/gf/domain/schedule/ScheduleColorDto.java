package com.sol.gf.domain.schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleColorDto {
    private long scheduleColorNo;
    private String scheduleColorName;
    private String scheduleColor;
}
