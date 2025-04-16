import { JSX, useState, useEffect } from "react";
import { createMenu, getRoles, getMenuList, updateMenu, updateMenuOrder } from "../../api/api.manager";
import { MenuCreateRequest, MenuPermissionRequest, Roles, MenuList } from "../../stores/types";
import { categoryMap, templateOptions } from "../../stores/category";
import Table from "../../components/table/Table";
import SortableRow from "./SortableRow";
import {
    DragEndEvent,
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

const MenuCreateAndModify = ({}): JSX.Element => {
    // 메뉴 생성 관련 상태
    const [createTableData, setCreateTableData] = useState<any[]>([{}]);
    const [menuName, setMenuName] = useState("");
    const [menuUrl, setMenuUrl] = useState("");
    const [categoryNo, setCategoryNo] = useState<number>(0);
    const [menuOrder, setMenuOrder] = useState<number>(0);
    const [permissions, setPermissions] = useState<MenuPermissionRequest[]>([]);
    
    // 메뉴 수정 관련 상태
    const [menuList, setMenuList] = useState<MenuList[]>([]);
    const [modifyTableData, setModifyTableData] = useState<any[]>([]);
    
    // 공통 상태
    const [roles, setRoles] = useState<Roles[]>([]);
    const [roleMap, setRoleMap] = useState<{[key: string]: number}>({});

    // 체크박스 옵션 생성 - 각 테이블에 대해 다른 참조를 사용
    const createCheckboxOptions = () => ({
        "조회 권한": roles.map(role => role.roleName),
        "작성 권한": roles.map(role => role.roleName)
    });
    
    const selectOptions = {
        "템플릿": templateOptions
    };

    // 메뉴 생성 테이블 데이터 핸들러
    const handleCreateTableEdit = (updatedData: any[]) => {
        setCreateTableData(updatedData);

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
            
            // 메뉴 이름과 URL 업데이트
            if (row["이름"]) {
                setMenuName(row["이름"]);
            }
            
            if (row["주소"]) {
                setMenuUrl(row["주소"]);
            }
            if (row["템플릿"]) {
                const no = categoryMap[row["템플릿"]];
                if (no) {
                    setCategoryNo(no);
                } else {
                    console.warn("알 수 없는 템플릿 이름입니다:", row["템플릿"]);
                }
            }
        });

        setPermissions(newPermissions);
    };

    // 메뉴 수정 테이블 데이터 핸들러
    const handleModifyTableEdit = (updatedData: any[]) => {
        setModifyTableData(updatedData);
    };

    // 메뉴 생성 제출 핸들러
    const handleCreateMenu = async () => {
        try {
            const menuCreateRequest: MenuCreateRequest = {
                menuName,
                menuUrl,
                categoryNo,
                menuOrder,
                permissions
            };
            
            await createMenu(menuCreateRequest);
            // 성공 후 상태 초기화나 알림 처리
            setCreateTableData([{}]);
            setMenuName("");
            setMenuUrl("");
            
            // 메뉴 목록 새로고침
            fetchMenuList();
        } catch (error) {
            console.error("메뉴 생성 실패:", error);
        }
    };

    // 메뉴 수정 제출 핸들러 - 인덱스 매개변수 무시하도록 수정
    const handleUpdateMenu = async (row: any, _rowIndex?: number) => {
        const menuNo = row.menuNo;
        if (!menuNo) {
            console.error("메뉴 번호가 없습니다.");
            return;
        }

        console.log("수정 시작:", row); 
    
        // 업데이트할 권한 정보 추출
        const updatedPermissions: MenuPermissionRequest[] = [];
    
        if (Array.isArray(row["조회 권한"])) {
            row["조회 권한"].forEach((roleName: string) => {
                const roleNo = roleMap[roleName];
                if (roleNo) {
                    updatedPermissions.push({
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
                    updatedPermissions.push({
                        roleNo: roleNo,
                        permissionType: "WRITE"
                    });
                }
            });
        }

        const uniqueRoleNos = [...new Set(updatedPermissions.map(permission => permission.roleNo))];
    
        const menuUpdateRequest = {
            menuNo,
            menuName: row["이름"],
            menuUrl: row["주소"],
            categoryNo: row.categoryNo,
            menuOrder: row.menuOrder,
            roleNos: uniqueRoleNos,
            permissions: updatedPermissions
        };
    
        try {
            await updateMenu(menuUpdateRequest)
                .then(() => {
                    console.log("메뉴 수정 성공");
                    // 성공 메시지 표시 또는 기타 처리
                    fetchMenuList(); // 수정 후 목록 새로고침
                })
                .catch(err => {
                    console.error("메뉴 수정 API 호출 실패:", err);
                });
        } catch (error) {
            console.error("메뉴 수정 실패:", error);
        }
    };

    // 메뉴 목록 조회
    const fetchMenuList = async () => {
        try {
            const menus = await getMenuList();
            setMenuList(menus);
            
            // 메뉴 목록을 테이블 데이터 형식으로 변환
            const tableData = menus.map(menu => {
                // 각 메뉴에 대한 조회/작성 권한을 가진 역할 이름 찾기
                const readRoles = menu.permissions
                .filter(perm => perm.permissionType === "READ")
                .map(perm => {
                    const role = roles.find(r => r.roleNo === perm.roleNo);
                    return role ? role.roleName : "";
                })
                .filter(name => name !== "");
                
                const writeRoles = menu.permissions
                    .filter(perm => perm.permissionType === "WRITE")
                    .map(perm => {
                        const role = roles.find(r => r.roleNo === perm.roleNo);
                        return role ? role.roleName : "";
                    })
                    .filter(name => name !== "");
                
                return {
                    menuNo: menu.menuNo,
                    "템플릿": menu.categoryName,
                    "이름": menu.menuName,
                    "주소": menu.menuUrl,
                    "조회 권한": readRoles,
                    "작성 권한": writeRoles,
                    categoryNo: menu.categoryNo,
                    menuOrder: menu.menuOrder
                };
            });
            
            setModifyTableData(tableData);
        } catch (error) {
            console.error("메뉴 목록 조회 실패:", error);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
    
        const oldIndex = modifyTableData.findIndex(item => item.menuNo === active.id);
        const newIndex = modifyTableData.findIndex(item => item.menuNo === over.id);
    
        const newData = arrayMove(modifyTableData, oldIndex, newIndex)
            .map((item, index) => ({
                ...item,
                menuOrder: index + 1 // 순서 재지정
            }));
    
        setModifyTableData(newData);
    
        // 백엔드에 순서 변경 요청
        const orderUpdatePayload = newData.map(item => ({
            menuNo: item.menuNo,
            menuOrder: item.menuOrder
        }));
    
        try {
            await updateMenuOrder(orderUpdatePayload); // API 호출
            console.log("메뉴 순서 업데이트 성공");
        } catch (error) {
            console.error("메뉴 순서 업데이트 실패:", error);
        }
    };

    // 역할 정보 로드
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
                
                // 역할 이름 -> 역할 번호 매핑 생성
                const mapping: {[key: string]: number} = {};
                rolesData.forEach(role => {
                    mapping[role.roleName] = role.roleNo;
                });
                setRoleMap(mapping);
            } catch (error) {
                console.error("역할 정보 로드 실패:", error);
            }
        };
        
        fetchRoles();
    }, []);
    
    // 역할 정보 로드 후 메뉴 목록 로드
    useEffect(() => {
        if (roles.length > 0) {
            fetchMenuList();
        }
    }, [roles]);

    return (
        <div className="menu-container">
            {/* 메뉴 생성 섹션 */}
            <div className="section-container">
                <span className="section-title">메뉴 생성</span>
                <Table
                    columns={["템플릿", "이름", "주소", "조회 권한", "작성 권한"]}
                    data={createTableData}
                    selectColumns={["템플릿"]}
                    inputColumns={["이름", "주소"]}
                    multiCheckboxColumns={["조회 권한", "작성 권한"]}
                    checkboxOptions={createCheckboxOptions()} // 함수로 호출하여 새로운 참조 생성
                    selectOptions={selectOptions}
                    onEdit={handleCreateTableEdit}
                />
                <div className="button-container">
                    <button 
                        className="create-button"
                        onClick={handleCreateMenu}
                    >
                        메뉴 생성
                    </button>
                </div>
            </div>
            
            {/* 메뉴 목록 조회 및 수정 섹션 */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={modifyTableData.map((item) => item.menuNo)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        columns={["menuNo", "템플릿", "이름", "주소", "조회 권한", "작성 권한", "작업"]}
                        data={modifyTableData}
                        selectColumns={["템플릿"]}
                        inputColumns={["이름", "주소"]}
                        multiCheckboxColumns={["조회 권한", "작성 권한"]}
                        checkboxOptions={createCheckboxOptions()} // 함수로 호출하여 새로운 참조 생성
                        selectOptions={selectOptions}
                        hiddenColumns={["menuNo"]}
                        actionColumn="작업"
                        actionButtons={[
                            {
                                label: "수정",
                                onClick: handleUpdateMenu, // 이미 수정됨
                                className: "edit-button"
                            }
                        ]}
                        onEdit={handleModifyTableEdit}
                        rowWrapperComponent={(row, idx, content) => (
                            <SortableRow key={row.menuNo} id={row.menuNo}>
                                {content}
                            </SortableRow>
                        )}
                    />
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default MenuCreateAndModify;