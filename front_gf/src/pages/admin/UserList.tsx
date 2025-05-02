import { useEffect, useState } from "react"
import { getUserList } from "../../api/api.user"
import { getRoles, updateUserRoles } from "../../api/api.manager";
import Table from "../../components/table/Table";
import { TableUser } from "../../stores/types";
import "../../styles/table.css";
import Button from "../../components/button/Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UserList() {
    const [users, setUsers] = useState<TableUser[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [roleMap, setRoleMap] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserList();
                const transformedData = userData.map(user => ({
                    ID: user.userId,
                    NAME: user.userName,
                    ROLE: user.roleName || "",
                    originalRole: user.roleName || ""
                }));
                setUsers(transformedData);

                const roleData = await getRoles();
                setRoles(roleData.map(role => role.roleName));
                
                const mapping: Record<string, number> = {};
                roleData.forEach(role => {
                    mapping[role.roleName] = role.roleNo;
                });
                setRoleMap(mapping);
            } catch (err: any) {
                console.error("데이터 불러오기 실패:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (updatedData: TableUser[]) => {
        setUsers(updatedData);
    };

    const handleSave = async () => {
        try {
            const changedUsers = users.filter(user => user.ROLE !== user.originalRole);
            
            if (changedUsers.length === 0) return;
            
            const updates = changedUsers.map(user => ({
                userId: user.ID,
                roleNo: roleMap[user.ROLE]
            }));
            
            await updateUserRoles(updates);
            
            setUsers(users.map(user => ({
                ...user,
                originalRole: user.ROLE
            })));
            
            alert("권한이 수정되었습니다.");
        } catch (error) {
            console.error("권한 수정 실패: ", error);
            alert("권한을 수정하지 못했습니다.");
        }
    };


    // TODO::사용자 삭제 기능 구현
    const handleDelete = (deleteData: TableUser[]) => {
        return null;
    }

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <p>사용자 목록</p>
                <Button
                    iconPosition="right"
                    color="bg-blue"
                    size="small"
                    onClick={handleSave}
                >
                    저장
                </Button>
            </div>
            <div className="user-list-body">
                <div className="user-table">
                    <Table
                        columns={["ID", "NAME", "ROLE", "삭제"]}
                        data={users}
                        selectColumns={["ROLE"]}
                        actionColumn="삭제"
                        actionButtons={[
                            {
                                label: <Button iconPosition="only" icon={faXmark} color="red" />,
                                onClick: handleDelete,
                                className: "delete-button"
                            }
                        ]}
                        options={{ ROLE: roles }}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    )
}