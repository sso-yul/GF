package com.sol.gf.domain.schedule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
