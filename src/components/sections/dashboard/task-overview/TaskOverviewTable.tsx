import { useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridColDef, useGridApiRef, GridApi } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import { rows } from 'data/taskOverview';
import ActionMenu from './ActionMenu';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'task',
    headerName: 'Task',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 220,
  },
  {
    field: 'members',
    headerName: 'Members',
    editable: false,
    sortable: false,
    align: 'left',
    flex: 2,
    minWidth: 140,
    renderCell: (params) => {
      return (
        <Stack height={1} alignItems="center">
          <AvatarGroup max={5}>
            {params.value.map((avatar: string) => (
              <Avatar key={avatar} alt="avatar_img" src={avatar} />
            ))}
          </AvatarGroup>
        </Stack>
      );
    },
  },
  {
    field: 'progress',
    headerName: 'Progress',
    editable: false,
    align: 'left',
    flex: 2,
    minWidth: 200,
    renderCell: (params) => {
      return (
        <Stack alignItems="center" gap={1} pr={2} height={1} width={1}>
          <Typography variant="body2" minWidth={40}>
            {params.value}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.value}
            sx={{
              width: 1,
              height: 5,
              borderRadius: 4,
            }}
          />
        </Stack>
      );
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    headerAlign: 'center',
    editable: false,
    flex: 1,
    minWidth: 140,
    renderCell: (params) => {
      const color =
        params.value === 'in progress'
          ? 'primary'
          : params.value === 'completed'
            ? 'success'
            : params.value === 'pending'
              ? 'warning'
              : 'info';
      return (
        <Stack direction="column" alignItems="center" justifyContent="center" height={1}>
          <Chip label={params.value} size="small" color={color} />
        </Stack>
      );
    },
  },
  {
    field: 'timeLeft',
    headerName: 'Time Left',
    headerAlign: 'right',
    align: 'right',
    editable: false,
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'action',
    headerAlign: 'right',
    align: 'right',
    editable: false,
    sortable: false,
    flex: 1,
    minWidth: 100,
    renderHeader: () => <ActionMenu />,
    renderCell: () => <ActionMenu />,
  },
];

interface TaskOverviewTableProps {
  searchText: string;
}

const TaskOverviewTable = ({ searchText }: TaskOverviewTableProps) => {
  const apiRef = useGridApiRef<GridApi>();

  useEffect(() => {
    apiRef.current.setQuickFilterValues(searchText.split(/\b\W+\b/).filter((word) => word !== ''));
  }, [searchText]);

  return (
    <DataGrid
      apiRef={apiRef}
      density="standard"
      columns={columns}
      rows={rows}
      rowHeight={60}
      disableColumnResize
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
      }}
      autosizeOptions={{
        includeOutliers: true,
        includeHeaders: false,
        outliersFactor: 1,
        expand: true,
      }}
      slots={{
        pagination: DataGridFooter,
      }}
      checkboxSelection
      pageSizeOptions={[5]}
    />
  );
};

export default TaskOverviewTable;
