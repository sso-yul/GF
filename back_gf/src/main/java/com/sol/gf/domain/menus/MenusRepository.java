package com.sol.gf.domain.menus;

import com.sol.gf.domain.category.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenusRepository extends JpaRepository<MenusEntity, Long> {
    List<MenusEntity> findByMenuCategoryNo(CategoryEntity menuCategoryNo);

    @Query("SELECT m FROM MenusEntity m JOIN FETCH m.menuCategoryNo")
    List<MenusEntity> findAllWithCategory();
}
