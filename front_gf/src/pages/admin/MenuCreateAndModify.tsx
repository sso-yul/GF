import { JSX, useState, useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { authApi } from "../../api/api.auth";
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
import IconButton from "../../components/button/IconButton";
import { faSort, faPenToSquare, faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

const MenuCreateAndModify = ({}): JSX.Element => {
    // 관리자만 메뉴 생성 테이블 보이도록 함
    const { isLoggedIn, user } = useAuthStore();
    const [hasAdminAccess, setHasAdminAccess] = useState(false);

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
                permissions: permissions ?? []
            };

            if(!menuCreateRequest.menuName.trim()) {
                alert("메뉴의 이름을 입력하세요.");
                return;
            }
            if(!menuCreateRequest.menuUrl.trim()) {
                alert("메뉴의 주소를 입력하세요.");
                return;
            }
            if (!menuCreateRequest.categoryNo) {
                alert("메뉴의 템플릿을 선택하세요.");
                return;
            }
            if (menuCreateRequest.permissions?.length === 0) {
                alert("메뉴의 권한을 설정하세요.");
                return;
            }
    
            await createMenu(menuCreateRequest);
            setCreateTableData([{}]);
            setMenuName("");
            setMenuUrl("");
            
            fetchMenuList();
            alert("메뉴 생성이 완료되었습니다.");
        } catch (error) {
            alert("메뉴 생성을 실패했습니다.");
        }
    };

    // 메뉴 수정 제출 핸들러 - 인덱스 매개변수 무시하도록 수정
    const handleUpdateMenu = async (row: any, _rowIndex?: number) => {
        const menuNo = row.menuNo;
        if (!menuNo) {
            alert("메뉴 번호가 없습니다. 새로고침 후 다시 시도해주세요.");
            return;
        }
    
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

            if(!menuUpdateRequest.menuName.trim()) {
                alert("메뉴의 이름은 비워둘 수 없습니다.");
                return;
            }
            if(!menuUpdateRequest.menuUrl.trim()) {
                alert("메뉴의 주소는 비워둘 수 없습니다.");
                return;
            }

            await updateMenu(menuUpdateRequest)
                .then(() => {
                    fetchMenuList();
                    alert("메뉴 수정이 완료되었습니다.");
                })
                .catch(() => {
                    alert("메뉴 수정을 실패했습니다.");
                });
        } catch (error) {
            alert("메뉴 수정 실패");
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
            await updateMenuOrder(orderUpdatePayload);
            fetchMenuList();
            console.log("메뉴 순서 업데이트 성공");
        } catch (error) {
            console.error("메뉴 순서 업데이트 실패:", error);
        }
    };

    const handleOrderMenu = (row: any, index?: number) => {};

    const handleDeleteMenu = async (deleteData: MenuCreateRequest) => {
        return null;
    }

    // 역할 정보 로드
    useEffect(() => {
        const verifyRole = async () => {
            if (isLoggedIn) {
                const result = await authApi.checkAdmin();
                setHasAdminAccess(result);
            } else {
                setHasAdminAccess(false);
            }
        };
        
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
        verifyRole();
        fetchRoles();
    }, [isLoggedIn, user]);
    
    // 역할 정보 로드 후 메뉴 목록 로드
    useEffect(() => {
        if (roles.length > 0) {
            fetchMenuList();
        }
    }, [roles]);

    return (
        <div className="menu-container">
            {/* 메뉴 생성 섹션 - 관리자만 가능 */}
            {isLoggedIn && hasAdminAccess && (
                <div className="section-container">
                    <p className="section-title">메뉴 생성</p>
                    <Table
                        tableId="create"
                        columns={["템플릿", "이름", "주소", "조회 권한", "작성 권한", "저장"]}
                        data={createTableData}
                        selectColumns={["템플릿"]}
                        inputColumns={["이름", "주소"]}
                        multiCheckboxColumns={["조회 권한", "작성 권한"]}
                        checkboxOptions={createCheckboxOptions()}
                        selectOptions={selectOptions}
                        actionColumns={{
                            "저장": {
                                buttons: [
                                    {
                                        label: <IconButton icon={faFloppyDisk} />,
                                        onClick: handleCreateMenu,
                                        className: "save-menu"
                                    }
                                ]
                            }
                        }}
                        onEdit={handleCreateTableEdit}
                    />
                </div>
            )}
            
            <div>
            {/* 메뉴 목록 조회 및 수정 섹션 */}
                <p>메뉴 수정</p>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={modifyTableData.map((item) => item.menuNo)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table
                            tableId="update"
                            columns={["menuNo", "순서", "템플릿", "이름", "주소", "조회 권한", "작성 권한", "수정", "삭제"]}
                            data={modifyTableData}
                            inputColumns={["이름", "주소"]}
                            multiCheckboxColumns={["조회 권한", "작성 권한"]}
                            checkboxOptions={createCheckboxOptions()}
                            selectOptions={selectOptions}
                            hiddenColumns={["menuNo"]}
                            actionColumns={{
                                "순서": {
                                    buttons: [
                                        {
                                            label: <IconButton icon={faSort} />,
                                            onClick: handleOrderMenu,
                                            className: "edit-order"
                                        }
                                    ]
                                },
                                "수정": {
                                    buttons: [
                                        {
                                            label: <IconButton icon={faPenToSquare} />,
                                            onClick: handleUpdateMenu,
                                            className: "edit-button"
                                        }
                                    ]
                                },
                                "삭제": {
                                    buttons: [
                                        {
                                            label: <IconButton icon={faXmark} color="red" />,
                                            onClick: handleDeleteMenu,
                                            className: "delete-button"
                                        }
                                    ]
                                }
                            }}
                            onEdit={handleModifyTableEdit}
                            rowWrapperComponent={(row, idx, content) => (
                                <SortableRow
                                    key={row.menuNo}
                                    id={row.menuNo}
                                    handleColumn="순서"
                                >
                                    {content}
                                </SortableRow>
                            )}
                        />
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default MenuCreateAndModify;