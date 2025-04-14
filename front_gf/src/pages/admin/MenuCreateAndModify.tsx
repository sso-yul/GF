import { JSX, useState, useEffect } from "react";
import { createMenu } from "../../api/api.manager";
import { MenuCreateRequest, MenuPermissionRequest } from "../../stores/types";

const MenuCreateAndModify =({}): JSX.Element => {
    const [menuOrder, setMenuOrder] = useState<number>(0);
    const [menuName, setMenuName] = useState("");
    const [menuUrl, setMenuUrl] = useState("");
    const [categoryNo, getCategoryNo] = useState<number>(0);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [permissions, setPermissions] = useState<MenuPermissionRequest[]>([]);


    return (
        <>
            <div>
                
            </div>
        </>
    );

};
export default MenuCreateAndModify;