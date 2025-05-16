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
import java.time.ZoneId;
import java.time.ZonedDateTime;

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
    @Convert(converter = ZonedDateTimeConverter.class)
    private ZonedDateTime scheduleStart;

    @Column(name = "schedule_end", nullable = false)
    @Convert(converter = ZonedDateTimeConverter.class)
    private ZonedDateTime scheduleEnd;

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
    public ScheduleEntity(String scheduleTitle, String scheduleContent, ZonedDateTime scheduleStart, ZonedDateTime scheduleEnd, Boolean scheduleAllDay,
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

    @Converter
    public static class ZonedDateTimeConverter implements AttributeConverter<ZonedDateTime, LocalDateTime> {
        @Override
        public LocalDateTime convertToDatabaseColumn(ZonedDateTime zonedDateTime) {
            if (zonedDateTime == null) return null;
            return zonedDateTime.toLocalDateTime();
        }

        @Override
        public ZonedDateTime convertToEntityAttribute(LocalDateTime localDateTime) {
            if (localDateTime == null) return null;
            return localDateTime.atZone(ZoneId.of("Asia/Seoul"));
        }
    }
}
