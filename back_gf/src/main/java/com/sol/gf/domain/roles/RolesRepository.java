package com.sol.gf.domain.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<RolesEntity, Long> {
    Optional<RolesEntity> findByRoleNo(long roleNo);
    List<RolesEntity> findByRoleNoNot(long roleNo);
}
