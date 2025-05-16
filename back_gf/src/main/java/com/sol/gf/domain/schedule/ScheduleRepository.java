package com.sol.gf.domain.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {
    Optional<ScheduleEntity> findByScheduleNo(long scheduleNo);
    List<ScheduleEntity> findByScheduleStartBetween(ZonedDateTime start, ZonedDateTime end);
}
