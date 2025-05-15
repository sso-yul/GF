package com.sol.gf.domain.schedule;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;
    // 일정 분류 생성
    @PostMapping("/color")
    public ResponseEntity<?> saveScheduleColor(@RequestBody ScheduleColorDto scheduleColorDto) {
        try {
            ScheduleColorDto createScheduleColor = scheduleService.createScheduleColor(scheduleColorDto);
            if (createScheduleColor == null) {
                return null;
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(createScheduleColor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 일정 색상 목록 조회
    @GetMapping("/colors")
    public ResponseEntity<?> getScheduleColors() {
        try {
            List<ScheduleColorDto> scheduleColors = scheduleService.getScheduleColors();
            return ResponseEntity.ok(scheduleColors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // 일정 저장
    @PostMapping("/save")
    public ResponseEntity<?> saveSchedule(@RequestBody ScheduleDto scheduleDto) {
        try {
            ScheduleDto createdSchedule = scheduleService.createSchedule(scheduleDto);
            if (createdSchedule == null) {
                return null;
            }
            return ResponseEntity.ok(createdSchedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // 일정 수정
    @PutMapping("/modify/{scheduleNo}")
    public ResponseEntity<?> modifySchedule(@PathVariable Long scheduleNo, @RequestBody  ScheduleDto scheduleDto) {
        try {
            ScheduleDto updatedSchedule = scheduleService.updateSchedule(scheduleNo, scheduleDto);
            if (updatedSchedule == null) {
                return null;
            }
            return ResponseEntity.ok(updatedSchedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // 일정 불러오기
    @GetMapping("/list")
    public ResponseEntity<List<ScheduleDto>> getSchedules(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        List<ScheduleDto> schedules = scheduleService.getSchedules(start, end);
        return ResponseEntity.ok(schedules);
    }

    // 일정 상세 불러오기
    @GetMapping("/one")
    public ResponseEntity<ScheduleDto> getOneSchedule (@RequestParam Long scheduleNo) {
        if (scheduleNo == null) {return ResponseEntity.badRequest().build();}

        ScheduleDto schedule = scheduleService.findById(scheduleNo);

        if (schedule == null) {return ResponseEntity.notFound().build();}

        return ResponseEntity.ok(schedule);
    }
}
