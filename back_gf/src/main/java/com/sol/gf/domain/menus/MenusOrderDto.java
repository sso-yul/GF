package com.sol.gf.domain.menus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenusOrderDto {
    private long menuNo;
    private long menuOrder;
}
