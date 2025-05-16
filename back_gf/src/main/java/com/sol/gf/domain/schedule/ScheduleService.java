package com.sol.gf.domain.schedule;

import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.domain.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.NoSuchElementException;
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

    // 일정 저장
    public ScheduleDto createSchedule(ScheduleDto scheduleDto) {

        ScheduleColorEntity scheduleColor = getScheduleColorEntity(scheduleDto.getScheduleColor());
        ScheduleEntity.ScheduleType entityScheduleType = convertToEntityScheduleType(scheduleDto.getScheduleType());

        ScheduleEntity newSchedule = ScheduleEntity.builder()
                .scheduleTitle(scheduleDto.getScheduleTitle())
                .scheduleContent(scheduleDto.getScheduleContent())
                .scheduleStart(scheduleDto.getScheduleStart())
                .scheduleEnd(scheduleDto.getScheduleEnd())
                .scheduleAllDay(scheduleDto.isScheduleAllDay())
                .scheduleType(entityScheduleType)
                .scheduleEditable(scheduleDto.isScheduleEditable())
                .scheduleColor(scheduleColor)
                .build();

        ScheduleEntity savedSchedule = scheduleRepository.save(newSchedule);

        ScheduleDto.ScheduleType dtoScheduleType = null;
        if (savedSchedule.getScheduleType() != null) {
            dtoScheduleType = ScheduleDto.ScheduleType.valueOf(savedSchedule.getScheduleType().name());
        }

        return ScheduleDto.builder()
                .scheduleTitle(savedSchedule.getScheduleTitle())
                .scheduleContent(savedSchedule.getScheduleContent())
                .scheduleStart(savedSchedule.getScheduleStart())
                .scheduleEnd(savedSchedule.getScheduleEnd())
                .scheduleAllDay(savedSchedule.getScheduleAllDay())
                .scheduleType(dtoScheduleType)
                .scheduleEditable(savedSchedule.getScheduleEditable())
                .scheduleColor(
                        savedSchedule.getScheduleColor() != null ?
                                savedSchedule.getScheduleColor().getScheduleColorNo() : null
                )
                .scheduleColorName(
                        savedSchedule.getScheduleColor() != null ?
                                savedSchedule.getScheduleColor().getScheduleColor() : null
                )
                .build();
    }

    // 일정 목록 불러오기
    @Transactional
    public List<ScheduleDto> getSchedules(ZonedDateTime start, ZonedDateTime end) {
        List<ScheduleEntity> schedules = scheduleRepository.findByScheduleStartBetween(start, end);
        return schedules.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 해당 일정 불러오기
    public ScheduleDto findById(Long scheduleNo) {
        ScheduleEntity scheduleEntity = scheduleRepository.findById(scheduleNo)
                .orElseThrow(() -> new NoSuchElementException("일정을 찾을 수 없음" + scheduleNo));
        return convertToDto(scheduleEntity);
    }

    // 해당 일정 수정
    @Transactional
    public ScheduleDto updateSchedule(Long scheduleNo, ScheduleDto scheduleDto) {
        ScheduleEntity existingSchedule = scheduleRepository.findById(scheduleNo)
                .orElseThrow(() -> new NoSuchElementException("일정을 찾을 수 없음: " + scheduleNo));

        ScheduleColorEntity scheduleColor = getScheduleColorEntity(scheduleDto.getScheduleColor());
        ScheduleEntity.ScheduleType entityScheduleType = convertToEntityScheduleType(scheduleDto.getScheduleType());

        existingSchedule.setScheduleTitle(scheduleDto.getScheduleTitle());
        existingSchedule.setScheduleContent(scheduleDto.getScheduleContent());
        existingSchedule.setScheduleStart(scheduleDto.getScheduleStart());
        existingSchedule.setScheduleEnd(scheduleDto.getScheduleEnd());
        existingSchedule.setScheduleAllDay(scheduleDto.isScheduleAllDay());
        existingSchedule.setScheduleType(entityScheduleType);
        existingSchedule.setScheduleEditable(scheduleDto.isScheduleEditable());
        existingSchedule.setScheduleColor(scheduleColor);

        ScheduleEntity savedSchedule = scheduleRepository.save(existingSchedule);

        return convertToDto(savedSchedule);
    }

    private ScheduleDto convertToDto(ScheduleEntity schedule) {
        ScheduleDto.ScheduleType dtoScheduleType = null;
        if (schedule.getScheduleType() != null) {
            dtoScheduleType = ScheduleDto.ScheduleType.valueOf(schedule.getScheduleType().name());
        }

        return ScheduleDto.builder()
                .scheduleNo(schedule.getScheduleNo())
                .scheduleTitle(schedule.getScheduleTitle())
                .scheduleContent(schedule.getScheduleContent())
                .scheduleStart(schedule.getScheduleStart())
                .scheduleEnd(schedule.getScheduleEnd())
                .scheduleAllDay(schedule.getScheduleAllDay())
                .scheduleType(dtoScheduleType)
                .scheduleEditable(schedule.getScheduleEditable())
                .scheduleColor(
                        schedule.getScheduleColor() != null ?
                                schedule.getScheduleColor().getScheduleColorNo() : null
                )
                .scheduleColorName(
                        schedule.getScheduleColor() != null ?
                                schedule.getScheduleColor().getScheduleColor() : null
                )
                .build();
    }

    private ScheduleColorEntity getScheduleColorEntity(Long scheduleColorNo) {
        if (scheduleColorNo == null) {
            return null;
        }
        return scheduleColorRepository.findById(scheduleColorNo)
                .orElseThrow(() -> new EntityNotFoundException("일정 색상을 찾을 수 없습니다."));
    }

    private ScheduleEntity.ScheduleType convertToEntityScheduleType(ScheduleDto.ScheduleType dtoScheduleType) {
        if (dtoScheduleType == null) {
            return null;
        }
        return ScheduleEntity.ScheduleType.valueOf(dtoScheduleType.name());
    }
}
