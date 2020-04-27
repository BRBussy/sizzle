import React, {useState} from 'react';
import {IconButton, Tooltip} from '@material-ui/core';
import {
    Add as CreateIcon,
    EditOutlined as EditIcon,
    Lock as ChangePasswordIcon,
    Assignment as RegisterUserIcon
} from '@material-ui/icons';
import {BPTable} from 'components/Table';
import {useUserStoreFindMany} from 'bizzle/user/Store';
import {User} from 'bizzle/user';
import {UserDialog} from 'components/User';
import RegisterUserDialog from './RegisterUserDialog';
import ChangePasswordDialog from './ChangePasswordDialog';

export default function Users() {
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [tableHeight, setTableHeight] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const {
        loading,
        findManyRequest,
        setFindManyRequest,
        findManyResponse
    } = useUserStoreFindMany();
    const [registerUserDialogOpen, setRegisterUserDialogOpen] = useState(false);
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

    if (tableHeight !== document.documentElement.clientHeight - 70) {
        setTableHeight(document.documentElement.clientHeight - 70);
    }

    return (
        <React.Fragment>
            {userDialogOpen &&
            <UserDialog
                closeDialog={() => setUserDialogOpen(false)}
                user={selectedUsers.length ? selectedUsers[0] : undefined}
            />}
            {registerUserDialogOpen &&
            <RegisterUserDialog
                closeDialog={() => setRegisterUserDialogOpen(false)}
                user={selectedUsers[0]}
            />}
            {changePasswordDialogOpen &&
            <ChangePasswordDialog
                closeDialog={() => setChangePasswordDialogOpen(false)}
                user={selectedUsers[0]}
            />}
            <BPTable
                height={tableHeight}
                loading={loading}
                title={'Users'}
                onQueryChange={(updatedQuery) => setFindManyRequest({
                    ...findManyRequest,
                    query: updatedQuery
                })}
                filters={[]}
                totalNoRecords={findManyResponse.total}
                toolBarControls={(() => {
                    if (selectedUsers.length === 1) {
                        return [
                            <Tooltip title='Edit'>
                                <IconButton
                                    size={'small'}
                                    onClick={() => setUserDialogOpen(true)}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>,
                            selectedUsers[0].registered
                                ? (<Tooltip title='Change Password'>
                                    <IconButton
                                        size={'small'}
                                        onClick={() => setChangePasswordDialogOpen(true)}
                                    >
                                        <ChangePasswordIcon/>
                                    </IconButton>
                                </Tooltip>)
                                : (<Tooltip title='Register'>
                                    <IconButton
                                        size={'small'}
                                        onClick={() => setRegisterUserDialogOpen(true)}
                                    >
                                        <RegisterUserIcon/>
                                    </IconButton>
                                </Tooltip>)
                        ];
                    } else if (selectedUsers.length > 1) {
                        return [];
                    }
                    return [
                        <Tooltip title='Create'>
                            <IconButton
                                size={'small'}
                                onClick={() => setUserDialogOpen(true)}
                            >
                                <CreateIcon/>
                            </IconButton>
                        </Tooltip>
                    ]
                })()}
                onSelectedDataChange={(allSelectedData: { [key: string]: any }[]) =>
                    setSelectedUsers(allSelectedData as User[])
                }
                columns={[
                    {
                        label: 'Name',
                        field: 'name'
                    },
                    {
                        label: 'Registered',
                        field: 'registered',
                        accessor: (data: any) => (data as User).registered ? 'True' : 'False'
                    }
                ]}
                data={findManyResponse.records}
            />
        </React.Fragment>
    )
}