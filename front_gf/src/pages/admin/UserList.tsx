import { useEffect, useState } from "react"
import { getUserList } from "../../api/api.user"
import { getRoles } from "../../api/api.manager";
import Table from "../../components/table/Table";
import "../../styles/table.css"

interface TableUser {
    ID: string;
    NAME: string;
    ROLE: string;
}

export default function UserList() {
    const [users, setUsers] = useState<TableUser[]>([]);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserList();
                const transformedData = userData.map(user => ({
                    ID: user.userId,
                    NAME: user.userName,
                    ROLE: user.roleName || "",
                }));
                setUsers(transformedData);

                const roleData = await getRoles();
                setRoles(roleData);
            } catch (err: any) {
                console.error("데이터 불러오기 실패:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (updatedData: TableUser[]) => {
        setUsers(updatedData);
    };

    return (
        <>
            <p>사용자 목록</p>
            <div className="user-container">
                <div className="user-table">
                    <Table
                        columns={["ID", "NAME", "ROLE", ""]}
                        data={users}
                        editableColumns={["ROLE"]}
                        options={{ ROLE: roles }}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </>
    )
}