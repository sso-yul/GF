import { JSX, useState, useEffect } from "react";
import { createMenu } from "../../api/api.manager";
import { getRoles } from "../../api/api.manager";
import { MenuCreateRequest, MenuPermissionRequest, Roles } from "../../stores/types";
import Table from "../../components/table/Table";

const MenuCreateAndModify =({}): JSX.Element => {
    const [tableData, setTableData] = useState<any[]>([]);
    
    const [menuNo, setMenuNo] = useState<number>(0);
    const [menuOrder, setMenuOrder] = useState<number>(0);
    const [menuName, setMenuName] = useState("");
    const [menuUrl, setMenuUrl] = useState("");
    const [categoryNo, getCategoryNo] = useState<number>(0);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [permissions, setPermissions] = useState<MenuPermissionRequest[]>([]);

    const [roles, setRoles] = useState<Roles[]>([]);
    const [roleMap, setRoleMap] = useState<{[key: string]: number}>({});

    const checkboxOptions: { [key: string]: string[] } = {
        "조회 권한": roles.map(role => role.roleName),
        "작성 권한": roles.map(role => role.roleName)
    }

    const handleTableEdit = (updatedData: any[]) => {
        setTableData(updatedData);

        // 새로운 permissions 배열 생성
        const newPermissions: MenuPermissionRequest[] = [];

        updatedData.forEach(row => {
            if (Array.isArray(row["조회 권한"])) {
                row["조회 권한"].forEach((roleName: string) => {
                    const roleNo = roleMap[roleName];
                    if (roleNo) {
                        newPermissions.push({
                            roleNo: roleNo,
                            permissionType: "READ"
                        });
                    }
                });
            }

            if (Array.isArray(row["작성 권한"])) {
                row["작성 권한"].forEach((roleName: string) => {
                    const roleNo = roleMap[roleName];
                    if (roleNo) {
                        newPermissions.push({
                            roleNo: roleNo,
                            permissionType: "WRITE"
                        });
                    }
                });
            }
        });

        setPermissions(newPermissions);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoles();
    }, [])

    return (
        <>
            {/* 테이블 생성 */}
            <div>
                <Table
                    columns={["템플릿", "이름", "주소", "조회 권한", "작성 권한"]}
                    data={[]}
                    selectColumns={["템플릿"]}
                    inputColumns={["이름", "주소"]}
                    multiCheckboxColumns={["조회 권한", "작성 권한"]}
                    checkboxOptions={checkboxOptions}
                />
            </div>
            {/* 테이블 수정 */}
            <div>

            </div>
        </>
    );

};
export default MenuCreateAndModify;