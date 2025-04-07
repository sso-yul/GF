package com.sol.gf.domain.user;

import com.sol.gf.domain.roles.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUserId(String userId);
    Optional<UserEntity> findByUserEmail(String userEmail);
    Optional<UserEntity> findByUserName(String userName);
    List<UserEntity> findByUserRoleNotIn(Collection<RolesEntity> userRole);
}
