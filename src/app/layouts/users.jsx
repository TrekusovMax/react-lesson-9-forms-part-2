import React from "react";
import { useLocation, useParams } from "react-router-dom";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserEditPage from "../components/page/userEditPage";

const Users = () => {
    const params = useParams();
    const { pathname } = useLocation();
    const isEdit = pathname.split("/").includes("edit");
    const { userId } = params;

    if (userId && isEdit) {
        return <UserEditPage userId={userId} />;
    }
    return <>{userId ? <UserPage userId={userId} /> : <UsersListPage />}</>;
};

export default Users;
