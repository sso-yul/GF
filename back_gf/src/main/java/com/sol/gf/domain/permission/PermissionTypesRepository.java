package com.sol.gf.domain.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionTypesRepository extends JpaRepository<PermissionTypesEntity, Long> {
    Optional<PermissionTypesEntity> findByPermissionName(String permissionName);
}
