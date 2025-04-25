package com.sol.gf.domain.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<RolesEntity, Long> {
    Optional<RolesEntity> findByRoleNo(long roleNo);
    Optional<RolesEntity> findByRoleName(String roleName);
    List<RolesEntity> findByRoleNoNotIn(Collection<Long> roleNo);
    List<RolesEntity> findByRoleNameIn(List<String> roleName);
}
