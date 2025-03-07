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
    @Column(name = "img_no")
    private Long imgNo;

    @Column(nullable = false)
    private String imgType;  // 예: "image/png"

    @Column(nullable = false)
    private String imgPath;

    @Lob
    @Column(nullable = false)
    private byte[] img;
}