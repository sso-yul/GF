package com.sol.gf.domain.roles;

import com.sol.gf.domain.user.UserEntity;
import com.sol.gf.security.jwt.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolesService {
    private final RolesRepository rolesRepository;

    public RolesService(RolesRepository rolesRepository) {
        this.rolesRepository = rolesRepository;
    }

    public List<RolesDto> getRolesFor(String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        if (userDetails != null) {
            UserEntity user = userDetails.getUser();
            RolesEntity userRole = user.getUserRole();

            if (userRole != null) {
                RolesDto rolesDto = new RolesDto(userRole.getRoleNo(), userRole.getRoleName());
                return List.of(rolesDto);
            }
        }

        Optional<RolesEntity> viewerRole = rolesRepository.findByRoleName("ROLE_VIEWER");


        if (viewerRole.isPresent()) {
            RolesEntity roleEntity = viewerRole.get();

            RolesDto viewerRolesDto = new RolesDto(
                    roleEntity.getRoleNo(),
                    roleEntity.getRoleName()
            );
            return List.of(viewerRolesDto);
        } else {
            throw new RuntimeException("ROLE_VIEWER 역할을 찾을 수 없습니다");
        }
    }
}
