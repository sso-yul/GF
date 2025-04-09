package com.sol.gf.domain.menus;

import com.sol.gf.domain.category.CategoryEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenusDto {
    private long menuOrder;
    private String menuName;
    private String menuUrl;
    private long categoryNo;
    private boolean canWrite;
    private List<String> roles;
}
