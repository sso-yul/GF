package com.sol.gf.domain.refreshToken;

import com.sol.gf.domain.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {
    Optional<RefreshTokenEntity> findByTokenId(Long tokenId);
    Optional<RefreshTokenEntity> findByRefreshToken(String refreshToken);
    void deleteByUser(UserEntity user);
}
