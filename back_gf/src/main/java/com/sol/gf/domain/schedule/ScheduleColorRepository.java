package com.sol.gf.domain.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScheduleColorRepository extends JpaRepository<ScheduleColorEntity, Long> {
    Optional<ScheduleColorEntity> findByScheduleColorNo(long scheduleColorNo);
}
