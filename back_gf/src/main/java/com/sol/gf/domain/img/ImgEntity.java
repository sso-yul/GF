package com.sol.gf.domain.img;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "tb_img")
public class ImgEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long img_no;

    @Column(nullable = false)
    private String img_type;  // 예: "image/png"

    @Column(nullable = false)
    private String img_path;

    @Lob
    @Column(nullable = false)
    private byte[] img;
}