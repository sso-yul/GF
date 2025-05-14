package com.sol.gf.domain.schedule;

import com.sol.gf.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.security.auth.Refreshable;
import java.time.LocalDateTime;

@Entity
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
    private LocalDateTime scheduleStart;

    @Column(name = "schedule_end", nullable = false)
    private LocalDateTime scheduleEnd;

    @Column(name = "schedule_allday", nullable = false)
    private Boolean scheduleAllDay = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_type", nullable = false)
    private ScheduleType scheduleType;

    @Column(name = "schedule_editable", nullable = false)
    private Boolean scheduleEditable = true;

    @ManyToOne
    @JoinColumn(name = "user_no", referencedColumnName = "user_no")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "schedule_color", referencedColumnName = "schedule_color_no")
    private ScheduleColorEntity scheduleColor;

    public enum ScheduleType {
        HOLIDAY,
        USER
    }
}
