package com.sol.gf.domain.schedule;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sol.gf.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.security.auth.Refreshable;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "tb_schedule")
public class ScheduleEntity {

    @Id
    @Column(name = "schedule_no")
    private long scheduleNo;

    @Column(name = "schedule_title", nullable = false)
    private String scheduleTitle;

    @Column(name = "schedule_content", nullable = false)
    private String scheduleContent;

    @Column(name = "schedule_start", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime scheduleStart;

    @Column(name = "schedule_end", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime scheduleEnd;

    @Column(name = "schedule_allday", nullable = false)
    private Boolean scheduleAllDay = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_type", nullable = false)
    private ScheduleType scheduleType;

    @Column(name = "schedule_editable", nullable = false)
    private Boolean scheduleEditable = true;

    @ManyToOne
    @JoinColumn(name = "schedule_color", referencedColumnName = "schedule_color_no")
    private ScheduleColorEntity scheduleColor;

    public enum ScheduleType {
        HOLIDAY,
        USER
    }

    @Builder
    public ScheduleEntity(String scheduleTitle, String scheduleContent, LocalDateTime scheduleStart, LocalDateTime scheduleEnd, Boolean scheduleAllDay,
                          ScheduleType scheduleType, Boolean scheduleEditable, ScheduleColorEntity scheduleColor) {
        this.scheduleTitle = scheduleTitle;
        this.scheduleContent = scheduleContent;
        this.scheduleStart = scheduleStart;
        this.scheduleEnd = scheduleEnd;
        this.scheduleAllDay = scheduleAllDay;
        this.scheduleType = scheduleType;
        this.scheduleEditable = scheduleEditable;
        this.scheduleColor = scheduleColor;
    }

}
