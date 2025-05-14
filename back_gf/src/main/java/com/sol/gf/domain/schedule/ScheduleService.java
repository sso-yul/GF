package com.sol.gf.domain.schedule;

import com.sol.gf.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleColorRepository scheduleColorRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    // 일정 분류 생성
    public ScheduleColorDto createScheduleColor(ScheduleColorDto scheduleColorDto) {
        ScheduleColorEntity newScheduleColor = ScheduleColorEntity.builder()
                                                .scheduleColorName(scheduleColorDto.getScheduleColorName())
                                                .scheduleColor(scheduleColorDto.getScheduleColor())
                                                .build();
        ScheduleColorEntity savedScheduleColor = scheduleColorRepository.save(newScheduleColor);

        return ScheduleColorDto.builder()
                .scheduleColorNo(savedScheduleColor.getScheduleColorNo())
                .scheduleColorName(savedScheduleColor.getScheduleColorName())
                .scheduleColor(savedScheduleColor.getScheduleColor())
                .build();
    }

    // 일정 색상 목록 조회
    public List<ScheduleColorDto> getScheduleColors() {
        List<ScheduleColorEntity> scheduleColorEntities = scheduleColorRepository.findAll();
        return scheduleColorEntities.stream()
                .map(entity -> ScheduleColorDto.builder()
                        .scheduleColorNo(entity.getScheduleColorNo())
                        .scheduleColorName(entity.getScheduleColorName())
                        .scheduleColor(entity.getScheduleColor())
                        .build())
                .collect(Collectors.toList());
    }
}
