import React, {useState} from 'react';
import {IconButton, Tooltip} from '@material-ui/core';
import {Add as CreateIcon, EditOutlined as EditIcon} from '@material-ui/icons';
import {BPTable} from 'components/Table';
import {useUserStoreFindMany} from 'bizzle/user/Store';
import {User} from 'bizzle/user';
import {UserDialog} from 'components/User';

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
                            </Tooltip>
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
                    }
                ]}
                data={findManyResponse.records}
            />
        </React.Fragment>
    )
}