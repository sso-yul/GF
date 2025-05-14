package com.sol.gf.domain.schedule;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tb_schedule_color")
public class ScheduleColorEntity {

    @Id
    @Column(name = "schedule_color_no")
    private long scheduleColorNo;

    @Column(name = "schedule_color_name", nullable = false)
    private String scheduleColorName;

    @Column(name = "schedule_color", nullable = false)
    private String scheduleColor;

    @Builder
    public ScheduleColorEntity(String scheduleColorName, String scheduleColor) {
        this.scheduleColorName = scheduleColorName;
        this.scheduleColor = scheduleColor;
    }
}
