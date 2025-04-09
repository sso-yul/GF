import { JSX, useState } from "react";
import { createMenu } from "../../api/api.manager";
import { MenuCreateRequest, MenuPermissionRequest } from "../../stores/types";

export default function MenuList() {
    const [menuOrder, setMenuOrder] = useState<number>(0);
    const [menuName, setMenuName] = useState("");
    const [menuUrl, setMenuUrl] = useState("");
    const [categoryNo, getCategoryNo] = useState<number>(0);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [permissions, setPermissions] = useState<MenuPermissionRequest[]>([]);

    return (
        <>
            
        </>
    )
}